import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { useAnimate } from 'react-simple-animate';
import SearchInput from './SearchInput';
import styled from 'styled-components';
import media from '../constants/media';
import queries from '../queries/User';
import units from '../constants/units';
import FlexRowCenterDiv from './FlexRowCenterDiv';
import Loader from './Loader';
import SearchUserResults from './SearchUserResults';
import transitions from '../constants/transitions';

const Root = styled.div`
  @media ${media.fromXsmallScreen} {
    width: 100%;
  }

  @media ${media.fromMediumScreen} {
    width: 400px;
  }

  margin: ${units.margin};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default () => {
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [{ style }] = useAnimate(transitions.defaultAnimation);

  const searchUser = async username => {
    setLoading(true);
    const {
      data: { searchUser: users },
    } = await API.graphql(graphqlOperation(queries.searchUser, { username }));
    setUsers(users);
    setLoading(false);
  };

  return (
    <FlexRowCenterDiv>
      <Root>
        <SearchInput
          id="searchUser"
          searchFunction={searchUser}
          label="Search user"
          clear={() => setUsers([])}
          displayClear={users.length > 0}
        />
        {isLoading && <Loader withMargin message={'Searching user'} />}
        {!isLoading && <SearchUserResults users={users} style={style} />}
      </Root>
    </FlexRowCenterDiv>
  );
};
