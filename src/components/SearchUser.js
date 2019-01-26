import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import SearchInput from './SearchInput';
import styled from 'styled-components';
import media from '../constants/media';
import queries from '../queries/User';
import units from '../constants/units';
import FlexRowCenterDiv from './FlexRowCenterDiv';
import Loader from './Loader';
import SearchUserResults from './SearchUserResults';
import { Animate } from 'react-simple-animate';

const Root = styled.div`
  @media ${media.fromXsmallScreen} {
    width: 100%;
  }

  @media ${media.fromMediumScreen} {
    width: 400px;
  }

  margin: ${units.margin};
  padding: ${units.paddingLarge};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default class SearchUser extends React.PureComponent {
  state = {
    users: [],
    loading: false,
  };
  searchUser = async username => {
    this.setState({ loading: true });
    const {
      data: { searchUser: users },
    } = await API.graphql(graphqlOperation(queries.searchUser, { username }));
    this.setState({ users, loading: false });
  };

  clear = () => {
    this.setState({ users: [] });
  };

  render() {
    const { users, loading } = this.state;
    return (
      <FlexRowCenterDiv>
        <Root>
          <SearchInput
            id="searchUser"
            searchFunction={this.searchUser}
            label="Search user"
            clear={this.clear}
            displayClear={users.length > 0}
          />
          {loading && <Loader withMargin />}

          {!loading && (
            <Animate play startStyle={{ opacity: 0 }} endStyle={{ opacity: 1 }}>
              <SearchUserResults users={users} />
            </Animate>
          )}
        </Root>
      </FlexRowCenterDiv>
    );
  }
}
