import React from 'react';
import MatchHistory from '../components/MatchHistory';

class Home extends React.PureComponent {
  state = {
    isLogged: true,
  };

  render() {
    return <MatchHistory />;
  }
}

export default Home;
