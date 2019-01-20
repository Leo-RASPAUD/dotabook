import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import SearchInput from './SearchInput';
import queries from '../queries/User';

export default class SearchUser extends React.PureComponent {
  state = {
    users: [],
  };
  searchUser = async username => {
    const {
      data: { searchUser: users },
    } = await API.graphql(graphqlOperation(queries.searchUser, { username }));
    this.setState({ users });
  };

  render() {
    const { users } = this.state;
    return (
      <div>
        <title>Search user</title>
        <SearchInput searchFunction={this.searchUser} />
        {users.map(user => (
          <div key={user.id}>
            <div>{user.username}</div>
            <div>{user.note}</div>
          </div>
        ))}
      </div>
    );
  }
}
