import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';
import authUtils from './utils/auth';
import PublicHome from './Routes/PublicHome';
import Home from './Routes/Home';
import Toolbar from './components/Toolbar';
import UserDetails from './Routes/UserDetails';
import Search from './Routes/Search';
import Loader from './components/commons/Loader';
import useFetchProfile from './hooks/useFetchProfile';

const RootWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(270deg, #242866, #03070b);
  background-size: 400% 400%;
`;

const Loading = styled(RootWrapper)`
  color: black;
  align-items: center;
  justify-content: center;
`;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = authUtils.isAuthenticated();
  return <Route {...rest} render={props => (isAuthenticated ? <Component {...props} /> : <Redirect to="/" />)} />;
};

const App = () => {
  const isLoading = useFetchProfile();
  const isAuthenticated = authUtils.isAuthenticated();

  if (isLoading) {
    return (
      <Loading>
        <Loader />
      </Loading>
    );
  }

  return (
    <Router>
      <RootWrapper>
        <Toolbar />
        <Switch>
          {!isAuthenticated && <Route path="/" exact component={PublicHome} />}
          <PrivateRoute path="/home" exact component={Home} />
          <PrivateRoute path="/search/user" exact component={Search} />
          <PrivateRoute path="/user/:userId" exact component={UserDetails} />
          <Redirect to={isAuthenticated ? '/home' : '/'} />
        </Switch>
      </RootWrapper>
    </Router>
  );
};

export default App;
