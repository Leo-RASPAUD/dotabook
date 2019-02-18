import React from 'react';
import styled from 'styled-components';
import { FaThumbsUp, FaThumbsDown, FaUser, FaSearch, FaRegSmile, FaRegFrown } from 'react-icons/fa';
import { SimpleImg } from 'react-simple-img';
import ReactTooltip from 'react-tooltip';
import colors from '../constants/colors';
import auth from '../utils/auth';
import units from '../constants/units';
import media from '../constants/media';
import steam from '../utils/steam';
import transitions from '../constants/transitions';
import Flex from './commons/Flex';
import Loader from './commons/Loader';

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
  user-select: none;
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

const ProfileIcon = styled.div`
  color: ${colors.primary}
  cursor: pointer;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.primary800};
  }
`;

const SearchIcon = styled(ProfileIcon)`
  color: ${colors.white}
  cursor: pointer;
  transition: ${transitions.default};
  opacity: ${props => (props.disabled ? 0.25 : 1)}
  &:hover {
    color: ${colors.primary800};
  }
`;

const LoadDetails = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default ({ teamName, players, updateNote, hasWon, loadPlayerDetails }) => {
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
                      onClick={() =>
                        updateNote({ isNotePlus: true, accountId: player.account_id, username: player.username })
                      }
                    />
                    <FaThumbsDown
                      style={(player.alreadyNoted && player.note === 1) || disabled ? inactive : ''}
                      color={colors.error}
                      onClick={() =>
                        updateNote({ isNotePlus: false, accountId: player.account_id, username: player.username })
                      }
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
              <Flex center full withPadding justify="space-around">
                {player.username && (
                  <>
                    <ProfileIcon
                      onClick={() => {
                        window.open(`https://steamcommunity.com/profiles/${steam.convertSteamId64(player.account_id)}`);
                      }}
                    >
                      <FaUser data-tip data-for={`profile-${player.account_id}`} />
                    </ProfileIcon>
                    <ReactTooltip id={`profile-${player.account_id}`} place="bottom" type="info" effect="solid">
                      <span>Open steam profile</span>
                    </ReactTooltip>
                  </>
                )}
                <div data-tip data-for={`note-${player.account_id}`}>
                  {player.note}
                  <ReactTooltip id={`note-${player.account_id}`} place="bottom" type="info" effect="solid">
                    <span>Behaviour note</span>
                  </ReactTooltip>
                </div>
              </Flex>

              <LoadDetails>
                {player.username && !player.won && !player.loadingDetails && (
                  <>
                    <SearchIcon
                      disabled={!player.canLoad}
                      onClick={() => {
                        if (!player.canLoad) return;
                        loadPlayerDetails({ id: player.account_id });
                      }}
                    >
                      <FaSearch data-tip data-for={`search-${player.account_id}`} />
                    </SearchIcon>
                    <ReactTooltip id={`search-${player.account_id}`} place="bottom" type="info" effect="solid">
                      <span>Get win / loss of 50 last matches</span>
                    </ReactTooltip>
                  </>
                )}
                {player.loadingDetails && <Loader />}
                {player.won && (
                  <>
                    <Flex alignItems="center">
                      <FaRegSmile size={'1.5rem'} color={colors.success} style={{ marginRight: units.marginSmall }} />
                      <span>{player.won}</span>
                    </Flex>
                    <Flex alignItems="center">
                      <FaRegFrown size={'1.5rem'} color={colors.error} style={{ marginRight: units.marginSmall }} />
                      <span>{player.lost}</span>
                    </Flex>
                  </>
                )}
              </LoadDetails>
            </PlayerData>
          );
        })}
      </PlayersWrapper>
    </Root>
  );
};
