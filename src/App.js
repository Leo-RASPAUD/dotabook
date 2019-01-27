import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import styled from 'styled-components';
import authUtils from './utils/auth';
import PublicHome from './PublicHome/PublicHome';
import Home from './Home/Home';
import Toolbar from './components/Toolbar';
import Search from './Search/Search';
import constants from './constants/constants';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from './mutations/User';
import queries from './queries/User';

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(270deg, #242866, #03070b);
  background-size: 400% 400%;
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
        const {
          data: { createUser: createdUser },
        } = await API.graphql(graphqlOperation(mutations.createUser, userToCreate));
        window.localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(createdUser));
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
        <RootWrapper>
          <Toolbar />
          <div style={{ flex: 1 }}>
            <Switch>
              {!isAuth && <Route path="/" exact component={PublicHome} />}
              <PrivateRoute path="/home" exact component={Home} />
              <PrivateRoute path="/user/search" exact component={Search} />
              <Redirect to={isAuth ? '/home' : '/'} />
            </Switch>
          </div>
        </RootWrapper>
      </Router>
    );
  }
}

export default App;
