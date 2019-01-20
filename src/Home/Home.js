import React from 'react';
import auth from '../utils/auth';
import MatchHistory from '../components/MatchHistory';
import SearchUser from '../components/SearchUser';

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
        <SearchUser />
        <MatchHistory />
        <button onClick={this.logout}>logout</button>
      </>
    );
  }
}

export default Home;
