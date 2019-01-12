import React from 'react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { FaLock } from 'react-icons/fa';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import queries from '../queries/Matches';
import auth from '../utils/auth';

const Player = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  display: flex;
  align-items: center;
  background-color: #90caf9;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
`;

const Data = styled.td`
  min-width: 150px;
  text-align: center;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
`;

const AvatarImage = styled.img`
  margin-right: 10px;
`;

const Table = styled.table`
  border-collapse: collapse;
  & tr td,
  th {
    box-shadow: 2px 0 0 0 #888, 0 2px 0 0 #888, 2px 2px 0 0 #888, 2px 0 0 0 #888 inset, 0 2px 0 0 #888 inset;
    height: 150px;
    padding: 10px;
  }
`;

const PlayerDetails = ({ player }) => {
  if (!player.playerDetails) {
    return (
      <Player>
        <AvatarImage src={player.heroImages.small} alt="hero" />
        <FaLock />
        <span>Private profile</span>
      </Player>
    );
  }
  return (
    <Player>
      <AvatarImage src={player.heroImages.small} alt="hero" />
      <Avatar>
        <AvatarImage src={player.playerDetails.avatar} alt="avatar not found" />
        <span>{player.playerDetails.personaname}</span>
      </Avatar>
    </Player>
  );
};

const MatchHistoryComponent = ({ matches }) => (
  <Table>
    <thead>
      <tr>
        <th>Match id</th>
        <th>Date</th>
        <th>Players</th>
      </tr>
    </thead>
    <tbody>
      {matches.map(match => {
        const date = fromUnixTime(match.start_time);
        return (
          <tr key={match.match_id}>
            <Data>{match.match_id}</Data>
            <Data>{format(date, 'dd/MM/yyyy k:m')}</Data>
            <td style={{ display: 'flex' }}>
              {match.players.map(player => (
                <PlayerDetails player={player} key={player.account_id + player.hero_id} />
              ))}
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

const MatchHistory = props => (
  <Connect query={graphqlOperation(queries.getMatches, { profileId: auth.getUserId() })}>
    {({ data: { getMatches: matches }, loading, error }) => {
      if (error) {
        return <h3>Error</h3>;
      }
      if (loading || !matches) {
        return <h3>Loading matches...</h3>;
      }
      return <MatchHistoryComponent matches={matches} />;
    }}
  </Connect>
);

export default MatchHistory;
