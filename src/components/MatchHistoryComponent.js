import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import time from '../utils/time';
import colors from '../constants/colors';
import { SimpleImg } from 'react-simple-img';

const Data = styled.td`
  min-width: 150px;
  text-align: center;
  text-transform: uppercase;
  color: ${props => (!props.status ? colors.white : props.isWon ? colors.success : colors.error)};
`;

const Table = styled.table`
  border-collapse: collapse;
  & th {
    font-weight: 500;
    background: none;
  }
  & tr {
    cursor: pointer;
  }
  & tr td,
  th {
    box-shadow: 0 2px 0 0 #2196f35c;
    padding: 10px;
  }
`;

const RowWrapper = styled.tr`
  background-color: ${props => (props.isSelected ? 'rgba(33, 150, 243, 0.25)' : 'none')};
`;

const isMatchWon = (radiant_win, isRadiant) => (isRadiant && radiant_win) || (!isRadiant && !radiant_win);

const MatchHistoryComponent = props => {
  const { matches, getMatchDetails, selectedMatchId } = props;
  const wonCount = matches.reduce((a, b) => a + isMatchWon(b.radiant_win, b.player_slot < 128), 0);
  const matchCount = matches.length;
  const killsAverage = (matches.reduce((a, b) => a + b.kills, 0) / matchCount).toFixed(2);
  const deathsAverage = (matches.reduce((a, b) => a + b.deaths, 0) / matchCount).toFixed(2);
  const assitsAverage = (matches.reduce((a, b) => a + b.assists, 0) / matchCount).toFixed(2);
  return (
    <Table>
      <thead>
        <tr>
          <th>Hero</th>
          <th>Date</th>
          <th>{`Result ( W:${wonCount} / L:${matches.length - wonCount} )`}</th>
          <th>Duration</th>
          <th>{`K (${killsAverage}) / D (${deathsAverage}) / A (${assitsAverage})`}</th>
        </tr>
      </thead>
      <tbody>
        {matches.map(match => {
          const date = fromUnixTime(match.start_time);
          const isRadiant = match.player_slot < 128;
          const isWon = isMatchWon(match.radiant_win, isRadiant);
          return (
            <RowWrapper
              key={match.match_id}
              onClick={() => getMatchDetails({ id: match.match_id })}
              isSelected={selectedMatchId === match.match_id}
            >
              <td>
                <SimpleImg
                  height={50}
                  width={100}
                  src={`https://api.opendota.com${match.hero.img}`}
                  placeholder={'#050911'}
                />
              </td>
              <Data>{format(date, 'dd/MM/yyyy kk:mm')}</Data>
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
  );
};

export default MatchHistoryComponent;
