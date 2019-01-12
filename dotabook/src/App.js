import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import authUtils from './utils/auth';
import Login from './Login/Login';
import Home from './Home/Home';

function PrivateRoute({ component: Component, ...rest }) {
  const isAuthenticated = authUtils.isAuthenticated();
  return <Route {...rest} render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)} />;
}

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route
            path="/steam-auth"
            exact
            component={props => {
              window.location = props.location.state.url;
              return null;
            }}
          />
          <PrivateRoute path="/home" exact component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default App;
