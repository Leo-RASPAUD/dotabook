import React from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
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

const UserDetails = props => {
  return (
    <Connect query={graphqlOperation(queries.getUser, { id: auth.getUserId() })}>
      {({ data: { getUser: user }, loading, error }) => {
        if (error) {
          return <h3>Error</h3>;
        }
        if (loading || !User) {
          return <h3>Loading user...</h3>;
        }
        return <User user={user} />;
      }}
    </Connect>
  );
};

export default UserDetails;
