import React from 'react';
import { Redirect } from 'react-router';
import auth from '../utils/auth';
import UserDetails from '../components/UserDetails';
import MatchHistory from '../components/MatchHistory';

class Home extends React.PureComponent {
  state = {
    isLogged: true,
  };

  logout = () => {
    auth.removeUser();
    this.setState({ isLogged: false });
  };

  render() {
    const { isLogged } = this.state;
    if (!isLogged) {
      return <Redirect to="/login" />;
    }
    return (
      <>
        <UserDetails />
        <MatchHistory />
        <button onClick={this.logout}>logout</button>
      </>
    );
  }
}

export default Home;
