import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import useUserStats from '../hooks/useUserStats';
import Loader from './commons/Loader';
import MatchesTable from './MatchesTable';
import PeersTable from './PeersTable';
import UserInformation from './UserInformation';
import media from '../constants/media';

const Root = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
const Info = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Matches = styled.div`
  display: none;
  align-items: center;
  @media ${media.fromMediumScreen} {
    display: block;
  }
`;

const UserDetails = ({ match, location }) => {
  const { user } = location.state;
  const [isLoadingStats, userStats] = useUserStats(user);
  return (
    <Root>
      {isLoadingStats && <Loader message={'Loading data'} height={200} />}
      {!isLoadingStats && (
        <>
          <UserInformation user={user} userStats={userStats} />
          <Info>
            <Matches>
              <MatchesTable readOnly matches={userStats.matches.slice(0, 10)} />
            </Matches>
            <PeersTable peers={userStats.peers.slice(0, 10)} />
          </Info>
        </>
      )}
    </Root>
  );
};

export default withRouter(UserDetails);
