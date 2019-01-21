import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import authUtils from './utils/auth';
import PublicHome from './PublicHome/PublicHome';
import Home from './Home/Home';
import Toolbar from './components/Toolbar';
import constants from './constants/constants';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from './mutations/User';
import queries from './queries/User';

const Background = styled.div`
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-position: center center;
    background-image: url('https://s3-ap-southeast-2.amazonaws.com/dotabook/background.jpg');
    filter: grayscale(75%) blur(10px);
    transform: scale(1.25);
  }
`;

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  return <Route {...rest} render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};

class App extends Component {
  state = {
    loading: true,
    isAuth: false,
  };
  componentDidMount = async () => {
    const isAuth = authUtils.isAuthenticated();
    if (isAuth) {
      this.setState({ loading: false, isAuth: true });
    } else {
      const parsed = window.location.href.split('&');
      if (parsed.length > 1 && !isAuth) {
        let profileId;
        parsed.forEach(a => {
          const split = a.split('openid.identity=');
          if (split.length > 1) {
            const identity = split[1];
            profileId = identity.split('%2Fid%2F')[1];
          }
        });

        const {
          data: { getUserProfile: user },
        } = await API.graphql(graphqlOperation(queries.getUserProfile, { profileId }));

        const { username, avatar, id } = user;
        const userToCreate = {
          username,
          avatar,
          id,
        };
        await API.graphql(graphqlOperation(mutations.createUser, userToCreate));
        window.localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(userToCreate));
        this.setState({ loading: false, isAuth: true });
      }
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, isAuth } = this.state;
    if (loading) {
      return <div>loading...</div>;
    }
    return (
      <Router>
        <Background>
          <RootWrapper>
            <Toolbar />
            <div style={{ flex: 1 }}>
              <Switch>
                {!isAuth && <Route path="/" exact component={PublicHome} />}
                <PrivateRoute path="/home" exact component={Home} />
                <Redirect to={isAuth ? '/home' : '/'} />
              </Switch>
            </div>
          </RootWrapper>
        </Background>
      </Router>
    );
  }
}

export default App;
