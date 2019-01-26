import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaAward } from 'react-icons/fa';
import { SimpleImg } from 'react-simple-img';
import colors from '../constants/colors';
import auth from '../utils/auth';
import Loader from './Loader';
import units from '../constants/units';

const TeamData = styled.div`
  display: flex;
`;

const Teams = styled.div`
  display: flex;
  justify-content: space-around;
`;

const WithMargin = styled.div`
  margin: ${units.margin};
`;

const Data = styled.div`
  margin: 5px;
`;

const inactive = { color: 'gray' };

const Team = ({ name, players, updateNote }) => {
  return (
    <div>
      <div>{name}</div>
      {players.map(player => {
        const disabled = '' + player.account_id === auth.getUserId();
        return (
          <TeamData key={player.player_slot}>
            <SimpleImg
              height={50}
              width={100}
              src={`https://api.opendota.com${player.hero.img}`}
              placeholder={'#050911'}
            />
            <Data>{player.username || 'Anonymous'}</Data>
            <Data>
              {player.kills} / {player.deaths} / {player.assists}
            </Data>
            <Data>{player.note}</Data>
            {!disabled && player.username && (
              <>
                <Data>
                  <FaAward />
                </Data>
                <Data>
                  <FaThumbsUp
                    style={(player.alreadyNoted && player.note === -1) || disabled ? inactive : ''}
                    color={colors.success}
                    onClick={() => updateNote({ isNotePlus: true, accountId: player.account_id })}
                  />
                </Data>
                <Data>
                  <FaThumbsDown
                    style={(player.alreadyNoted && player.note === 1) || disabled ? inactive : ''}
                    color={colors.error}
                    onClick={() => updateNote({ isNotePlus: false, accountId: player.account_id })}
                  />
                </Data>
              </>
            )}
          </TeamData>
        );
      })}
    </div>
  );
};

class MatchDetails extends React.PureComponent {
  render() {
    const { loadingDetails, data, updateNote } = this.props;
    if (!data || loadingDetails || data.players.length === 0) {
      return (
        <WithMargin>
          <div>Loading match details...</div>
          <Loader />
        </WithMargin>
      );
    }

    const { players } = data;
    const dire = players.filter(player => !player.isRadiant);
    const radiant = players.filter(player => player.isRadiant);

    return (
      <WithMargin>
        <Teams>
          <Team name="Dire" players={dire} updateNote={updateNote} />
          <Team name="Radiant" players={radiant} updateNote={updateNote} />
        </Teams>
      </WithMargin>
    );
  }
}

export default MatchDetails;
