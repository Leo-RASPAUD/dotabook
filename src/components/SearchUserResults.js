import React from 'react';
import { withRouter } from 'react-router';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import units from '../constants/units';
import { SimpleImg } from 'react-simple-img';
import { FaUser, FaThumbsUp, FaThumbsDown, FaArrowRight } from 'react-icons/fa';
import colors from '../constants/colors';
import transitions from '../constants/transitions';
import steam from '../utils/steam';
import media from '../constants/media';

const Root = styled.div`
  @media ${media.fromXsmallScreen} {
    width: 100%;
  }

  @media ${media.fromMediumScreen} {
    width: 400px;
  }

  display: flex;
  padding: 1px;
  margin-top: ${units.margin};
  background: white;
  color: black;
  border-radius: ${units.borderRadius};
  user-select: none;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex: 1;
`;

const GenericIcon = styled.div`
  padding: 0 ${units.paddingLarge};
  color: ${colors.primary}
  cursor: pointer;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.primary800};
  }
`;

const WrapperNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 50px;
`;

const Username = styled.div`
  @media ${media.fromXsmallScreen} {
    max-width: 120px;
  }

  @media ${media.fromMediumScreen} {
    max-width: 200px;
  }
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchUserResults = props => {
  const { users, history } = props;
  return users.map(user => (
    <Root key={user.id}>
      <SimpleImg
        width="50px"
        height="50px"
        src={user.avatar}
        placeholder={'white'}
        style={{ borderRadius: `${units.borderRadius} 0 0 ${units.borderRadius}` }}
      />
      <Content>
        <Username>{user.username}</Username>

        <WrapperNote data-tip data-for="note">
          {user.note >= 0 && <FaThumbsUp color={user.note > 0 ? colors.success : 'gray'} size={'1.5em'} />}
          {user.note < 0 && <FaThumbsDown color={colors.error} size={'1.5em'} />}
          <div>{user.note}</div>
          <ReactTooltip id="note" place="right" type="info" effect="solid">
            <span>User behaviour note</span>
          </ReactTooltip>
        </WrapperNote>

        <GenericIcon
          onClick={() => {
            window.open(`https://steamcommunity.com/profiles/${steam.convertSteamId64(user.id)}`);
          }}
        >
          <FaUser size={'1.5em'} data-tip data-for="profile" />
        </GenericIcon>
        <ReactTooltip id="profile" place="right" type="info" effect="solid">
          <span>Open steam profile</span>
        </ReactTooltip>

        <GenericIcon
          onClick={() => {
            history.push({
              pathname: `/user/${user.id}`,
              state: {
                user,
              },
            });
          }}
        >
          <FaArrowRight size={'1.5em'} data-tip data-for="details" />
        </GenericIcon>
        <ReactTooltip id="details" place="right" type="info" effect="solid">
          <span>Open details</span>
        </ReactTooltip>
      </Content>
    </Root>
  ));
};

export default withRouter(SearchUserResults);
