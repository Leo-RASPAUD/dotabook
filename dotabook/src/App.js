import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React, { Component } from 'react';
import authUtils from './utils/auth';
import Login from './Login/Login';
import Home from './Home/Home';

class App extends Component {
  render() {
    const isAuthenticated = authUtils.isAuthenticated();
    console.log('app');
    return (
      <>
        {!isAuthenticated && (
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
              <Redirect to="/login" />
            </Switch>
          </Router>
        )}
        {isAuthenticated && (
          <Router>
            <Switch>
              <Route path="/home" exact component={Home} />
              <Redirect to="/home" />
            </Switch>
          </Router>
        )}
      </>
    );
  }
}

export default App;
