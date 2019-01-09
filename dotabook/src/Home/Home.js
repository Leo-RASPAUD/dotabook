import React from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { Redirect } from 'react-router';
import queries from '../queries/User';
import auth from '../utils/auth';

const User = ({ user: { username, avatar, note, id } }) => {
  return (
    <>
      <div>{username}</div>
      <img src={avatar} alt="avatar" />
      <div>{note}</div>
      <div>{id}</div>
    </>
  );
};

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
    console.log(isLogged);
    if (!isLogged) {
      return <Redirect to="/login" />;
    }
    return (
      <>
        <Connect query={graphqlOperation(queries.getUser, { id: auth.getUserId() })}>
          {({ data: { getUser: user }, loading, error }) => {
            if (error) {
              return <h3>Error</h3>;
            }
            if (loading || !User) {
              return <h3>Loading...</h3>;
            }
            return <User user={user} />;
          }}
        </Connect>
        <button onClick={this.logout}>logout</button>
      </>
    );
  }
}

export default Home;
