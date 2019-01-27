import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { SimpleImg } from 'react-simple-img';
import ReactTooltip from 'react-tooltip';
import colors from '../constants/colors';
import auth from '../utils/auth';
import units from '../constants/units';
import media from '../constants/media';

const mediaQueries = `
    @media ${media.fromXsmallScreen} {
    width: 50px;
    max-width: 50px;
  }

  @media ${media.fromXlargeScreen} {
    width: 75px;
    max-width: 75px;
  }
  @media ${media.fromXXlargeScreen} {
    width: 125px;
    max-width: 125px;
  }
  @media ${media.fromXXXlargeScreen} {
    width: 175px;
    max-width: 175px;
  }
`;

const inactive = { color: 'gray' };

const PlayerData = styled.div`
  ${mediaQueries}
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: ${units.margin};
  background: ${props => (props.isDire ? 'rgba(244, 67, 54, 0.1)' : 'rgba(76, 175, 80, 0.1)')};
  padding: 0 ${units.paddingSmall};
  border-radius: 10px;
  overflow: hidden;
  user-select: none;
`;
const PlayersWrapper = styled.div`
  display: flex;
`;
const Data = styled.div`
  margin: 5px;
  height: 25px;
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-size: 30px;
  color: white;
  text-shadow: 0px 0px 20px ${props => (props.isDire ? colors.error : colors.success)};
`;

const NoteBlock = styled.div`
  height: 20px;
  display: flex;
  justify-content: space-around;
  padding: ${units.padding};
  width: 100%;
`;

const Username = styled.div`
  ${mediaQueries}
  flex: 1;
  white-space: nowrap;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 25px;
  text-align: center;
  margin-top: ${units.marginSmall};
`;

export default ({ teamName, players, updateNote, hasWon }) => {
  const isDire = teamName === 'Dire';
  return (
    <Root>
      <Title isDire={isDire}>{teamName}</Title>
      <PlayersWrapper>
        {players.map(player => {
          const disabled = '' + player.account_id === auth.getUserId();
          const key = '' + player.player_slot;
          return (
            <PlayerData key={key} isDire={isDire}>
              <NoteBlock>
                {!disabled && player.username && (
                  <>
                    <FaThumbsUp
                      style={(player.alreadyNoted && player.note === -1) || disabled ? inactive : ''}
                      color={colors.success}
                      onClick={() => updateNote({ isNotePlus: true, accountId: player.account_id })}
                    />
                    <FaThumbsDown
                      style={(player.alreadyNoted && player.note === 1) || disabled ? inactive : ''}
                      color={colors.error}
                      onClick={() => updateNote({ isNotePlus: false, accountId: player.account_id })}
                    />
                  </>
                )}
              </NoteBlock>
              <SimpleImg
                src={`https://api.opendota.com${player.hero.img}`}
                height={50}
                width={100}
                placeholder={'#050911'}
              />
              <Username data-tip data-for={key}>
                {player.username || 'Anonymous'}
                <ReactTooltip id={key} place="bottom" type="info" effect="solid">
                  <span>{player.username || 'Anonymous'}</span>
                </ReactTooltip>
              </Username>
              <Data>
                {player.kills} / {player.deaths} / {player.assists}
              </Data>
              <Data>{player.note}</Data>
            </PlayerData>
          );
        })}
      </PlayersWrapper>
    </Root>
  );
};
