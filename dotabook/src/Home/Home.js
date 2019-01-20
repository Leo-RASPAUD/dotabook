import React from 'react';
import auth from '../utils/auth';
import MatchHistory from '../components/MatchHistory';

class Home extends React.PureComponent {
  state = {
    isLogged: true,
  };

  logout = () => {
    auth.removeUser();
    window.location.replace('/login');
  };

  render() {
    return (
      <>
        <MatchHistory />
        <button onClick={this.logout}>logout</button>
      </>
    );
  }
}

export default Home;
