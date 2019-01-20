import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import time from '../utils/time';
import colors from '../constants/colors';

const Data = styled.td`
  min-width: 150px;
  text-align: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  & th {
    font-weight: 500;
  }
  & tr {
    cursor: pointer;
  }
  & tr td,
  th {
    box-shadow: 2px 0 0 0 #888, 0 2px 0 0 #888, 2px 2px 0 0 #888, 2px 0 0 0 #888 inset, 0 2px 0 0 #888 inset;
    padding: 10px;
  }
`;

const RowWrapper = styled.tr`
  background-color: ${props => (props.isSelected ? colors.primary100 : 'white')};
`;

const MatchHistoryComponent = props => {
  const { matches, getMatchDetails, selectedMatchId } = props;
  return (
    <Table>
      <thead>
        <tr>
          <th>Hero</th>
          <th>Date</th>
          <th>Result</th>
          <th>Duration</th>
          <th>K / D / A</th>
        </tr>
      </thead>
      <tbody>
        {matches.map(match => {
          const date = fromUnixTime(match.start_time);
          const isRadiant = match.player_slot < 128;
          const isWon = (isRadiant && match.radiant_win) || (!isRadiant && !match.radiant_win);
          return (
            <RowWrapper
              key={match.match_id}
              onClick={() => getMatchDetails({ id: match.match_id })}
              isSelected={selectedMatchId === match.match_id}
            >
              <td>
                <img src={`https://api.opendota.com${match.hero.img}`} alt="hero" height={50} width={100} />
              </td>
              <Data>{format(date, 'dd/MM/yyyy k:m')}</Data>
              <Data>{isWon ? 'Won match' : 'Lost match'}</Data>
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
