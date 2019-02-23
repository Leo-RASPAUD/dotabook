import React from 'react';
import SearchUser from '../components/SearchUser';
import { Animate } from 'react-simple-animate';

class Home extends React.PureComponent {
  render() {
    return (
      <Animate play startStyle={{ opacity: 0 }} endStyle={{ opacity: 1 }}>
        <SearchUser />
      </Animate>
    );
  }
}

export default Home;
