import React, { useEffect } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import { useAnimate } from 'react-simple-animate';
import transitions from '../constants/transitions';
import useUserMatches from '../hooks/useUserMatches';
import Loader from './commons/Loader';
import MatchesTable from './MatchesTable';

const Root = styled.div`
  flex: 1;
  overflow: auto;
`;

const UserDetails = ({ match, location }) => {
  const { userId } = match.params;
  const [isLoadingUsers, matches] = useUserMatches({ userId });
  const [{ style }, startAnimation] = useAnimate(transitions.defaultAnimation);

  const { user } = location.state;

  console.log(style);
  useEffect(() => {
    if (!isLoadingUsers) {
      startAnimation(true);
    }
  }, [isLoadingUsers]);

  return (
    <Root>
      <div>
        {isLoadingUsers && <Loader message="Loading matches" />}
        {!isLoadingUsers && <MatchesTable readOnly matches={matches.slice(0, 10)} style={style} />}
      </div>
      <div>{user.username}</div>
    </Root>
  );
};

export default withRouter(UserDetails);
