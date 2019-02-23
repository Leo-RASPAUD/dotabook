import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { SimpleImg } from 'react-simple-img';
import time from '../utils/time';
import colors from '../constants/colors';
import transitions from '../constants/transitions';
import matchUtils from '../utils/matches';
import Flex from './commons/Flex';
import Title from './commons/Title';

const Table = styled.table`
  border-collapse: collapse;

  & th {
    font-weight: 500;
    background: none;
  }
  & tr {
    transition: ${transitions.default};
    cursor: ${props => (props.readOnly ? '' : 'pointer')};
    :hover {
      background-color: ${props => (props.readOnly ? '' : '#0d47a15e')};
    }
  }
  & tr td,
  th {
    box-shadow: 0 2px 0 0 #2196f35c;
    padding: 10px;
  }
`;

const MatchId = styled.div`
  font-size: 12px;
  opacity: 0.75;
  text-align: left;
  margin-bottom: 5px;
`;

const TextAlignLeft = styled.div`
  text-align: left;
`;

const RowWrapper = styled.tr`
  background-color: ${props => (props.isSelected ? 'rgba(33, 150, 243, 0.25)' : 'none')};
`;

const Data = styled.td`
  min-width: 150px;
  text-align: center;
  text-transform: uppercase;
  color: ${props => (!props.status ? colors.white : props.isWon ? colors.success : colors.error)};
`;

const MatchesTable = ({ matches, readOnly, getMatchDetails, selectedMatchId }) => {
  const wonCount = matchUtils.getMatchesWonCount(matches);
  const matchCount = matches.length;
  const killsAverage = (matches.reduce((a, b) => a + b.kills, 0) / matchCount).toFixed(2);
  const deathsAverage = (matches.reduce((a, b) => a + b.deaths, 0) / matchCount).toFixed(2);
  const assitsAverage = (matches.reduce((a, b) => a + b.assists, 0) / matchCount).toFixed(2);
  const results = readOnly ? 'Result' : `Result ( W:${wonCount} / L:${matches.length - wonCount} )`;
  const kda = readOnly ? 'K / D / A' : `K (${killsAverage}) / D (${deathsAverage}) / A (${assitsAverage})`;
  return (
    <Flex withPadding column>
      <Title>Matches</Title>
      <Table readOnly>
        <thead>
          <tr>
            <th>Hero</th>
            <th>Date</th>
            <th>{results}</th>
            <th>Duration</th>
            <th>{kda}</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => {
            const date = fromUnixTime(match.start_time);
            const isRadiant = match.player_slot < 128;
            const isWon = matchUtils.isMatchWon(match.radiant_win, isRadiant);
            return (
              <RowWrapper
                key={match.match_id}
                onClick={() => {
                  if (readOnly) return;
                  getMatchDetails({ id: match.match_id });
                }}
                isSelected={!readOnly && selectedMatchId === match.match_id}
              >
                <td>
                  <SimpleImg
                    height={50}
                    width={100}
                    src={`https://api.opendota.com${match.hero.img}`}
                    placeholder={'#050911'}
                  />
                </td>
                <Data>
                  <MatchId>{match.match_id}</MatchId>
                  <TextAlignLeft>{format(date, 'dd/MM/yyyy kk:mm')}</TextAlignLeft>
                </Data>
                <Data status isWon={isWon}>
                  {isWon ? 'Won match' : 'Lost match'}
                </Data>
                <Data>{time.secondsToHms(match.duration)}</Data>
                <Data>
                  {match.kills} / {match.deaths} / {match.assists}
                </Data>
              </RowWrapper>
            );
          })}
        </tbody>
      </Table>
    </Flex>
  );
};

export default MatchesTable;
