import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import { SimpleImg } from 'react-simple-img';
import format from 'date-fns/format';
import matchUtils from '../utils/matches';
import units from '../constants/units';
import colors from '../constants/colors';
import Flex from './commons/Flex';

const Match = styled.div`
  display: flex;
  padding: ${units.padding};
  box-shadow: 0 2px 0 0 #2196f35c;
  justify-content: space-between;
  align-items: center;
`;

const IsWon = styled.div`
  color: ${props => (!props.status ? colors.white : props.isWon ? colors.success : colors.error)};
`;

const MatchId = styled.div`
  font-size: 12px;
  opacity: 0.75;
  text-align: left;
  margin-bottom: 5px;
`;

export default props => {
  const { match } = props;
  const date = fromUnixTime(match.start_time);
  const isRadiant = match.player_slot < 128;
  const isWon = matchUtils.isMatchWon(match.radiant_win, isRadiant);
  return (
    <Match>
      <SimpleImg height={50} width={100} src={`https://api.opendota.com${match.hero.img}`} placeholder={'#050911'} />
      <Flex>
        <MatchId>{match.match_id}</MatchId>
        <MatchId>{format(date, 'dd/MM/yyyy kk:mm')}</MatchId>
      </Flex>
      <IsWon status isWon={isWon}>
        {isWon ? 'Won' : 'Lost'}
      </IsWon>
    </Match>
  );
};
