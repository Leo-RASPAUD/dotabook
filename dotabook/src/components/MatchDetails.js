import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaAward } from 'react-icons/fa';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from '../mutations/User';

const convertSteamId64 = id => '765' + (+id + 61197960265728);

const TeamData = styled.div`
  display: flex;
`;

const Teams = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Data = styled.div`
  margin: 5px;
`;

const Team = ({ name, players, updateNote }) => {
  return (
    <div>
      <div>{name}</div>
      {players.map(player => (
        <TeamData key={player.player_slot}>
          <img src={`https://api.opendota.com${player.hero.img}`} alt="hero" height={50} width={100} />
          <Data>{player.personaname || 'Anonymous'}</Data>
          <Data>
            {player.kills} / {player.deaths} / {player.assists}
          </Data>
          <Data>
            <FaAward />
          </Data>
          <Data>{player.note}</Data>
          {player.personaname && (
            <>
              <Data>
                <FaThumbsUp onClick={() => updateNote({ note: player.note++ })} />
              </Data>
              <Data>
                <FaThumbsDown onClick={() => updateNote({ note: player.note-- })} />
              </Data>
            </>
          )}
        </TeamData>
      ))}
    </div>
  );
};

class MatchDetails extends React.PureComponent {
  state = {
    players: [],
  };

  componentWillMount = () => {
    const { data } = this.props;
    this.setState({ players: data.players });
  };

  updateNote = async ({ note, account_id }) => {
    const { players } = this.state;
    const updatedUser = await API.graphql(
      graphqlOperation(mutations.updateNote, { note, id: convertSteamId64(account_id) }),
    );
    console.log(updatedUser);
    this.setState({
      players: players.map(player => {
        if (player.account_id === account_id) {
          return updatedUser;
        }
        return player;
      }),
    });
  };

  render() {
    const { loadingDetails } = this.props;
    const { players } = this.state;
    if (loadingDetails || players.length === 0) {
      return <div>Loading details...</div>;
    }

    const dire = players.filter(player => !player.isRadiant);
    const radiant = players.filter(player => player.isRadiant);

    return (
      <Teams>
        <Team name="Dire" players={dire} updateNote={this.updateNote} />
        <Team name="Radiant" players={radiant} updateNote={this.updateNote} />
      </Teams>
    );
  }
}

export default MatchDetails;
