import React from 'react';
import styled from 'styled-components';
import media from '../constants/media';
import MobileMatch from './MobileMatch';

const mediaQueries = `
@media ${media.fromMediumScreen} {
  display: none;
}`;

const Root = styled.div`
  ${mediaQueries}
  flex-direction: column;
  width: 100%;
`;

export default props => {
  const { matches } = props;

  return (
    <Root>
      {matches.map(match => (
        <MobileMatch match={match} key={match.match_id} />
      ))}
    </Root>
  );
};
