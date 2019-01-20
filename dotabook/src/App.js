import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import authUtils from './utils/auth';
import PublicHome from './PublicHome/PublicHome';
import Home from './Home/Home';
import Toolbar from './components/Toolbar';
import constants from './constants/constants';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from './mutations/User';
import queries from './queries/User';

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = authUtils.isAuthenticated();
  return <Route {...rest} render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
}

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
        const profileId = parsed[3].split('%2Fid%2F')[1];
        const {
          data: { getUserProfile: user },
        } = await API.graphql(graphqlOperation(queries.getUserProfile, { profileId }));
        const { username, avatar, id } = user;
        await API.graphql(graphqlOperation(mutations.createUser, { username, avatar, note: 0, id }));
        window.localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(user));
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
      <>
        <Router>
          <>
            <Toolbar />
            <Switch>
              {!isAuth && <Route path="/" exact component={PublicHome} />}
              <PrivateRoute path="/home" exact component={Home} />
              <Redirect to={isAuth ? '/home' : '/'} />
            </Switch>
          </>
        </Router>
      </>
    );
  }
}

export default App;
