import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaAward } from 'react-icons/fa';
import { SimpleImg } from 'react-simple-img';
import colors from '../constants/colors';
import auth from '../utils/auth';
import units from '../constants/units';

const inactive = { color: 'gray' };

const PlayerData = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${units.margin};
`;
const PlayersWrapper = styled.div`
  display: flex;
`;
const Data = styled.div`
  margin: 5px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ({ teamName, players, updateNote }) => {
  return (
    <Root>
      <div>{teamName}</div>
      <PlayersWrapper>
        {players.map(player => {
          const disabled = '' + player.account_id === auth.getUserId();
          return (
            <PlayerData key={player.player_slot}>
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
            </PlayerData>
          );
        })}
      </PlayersWrapper>
    </Root>
  );
};
