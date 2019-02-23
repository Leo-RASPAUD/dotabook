import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import auth from '../utils/auth';
import Login from './Login';
import ToolbarMenu from './ToolbarMenu';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import transitions from '../constants/transitions';
import media from '../constants/media';

const mediaQueries = `
@media ${media.fromXsmallScreen} {
  display: none;
}

@media ${media.fromMediumScreen} {
  display: flex;
}`;

const Toolbar = styled.div`
  color: ${colors.white}
  height: 50px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  display: flex;
  align-items: center;
  padding-left: ${units.padding};
  font-size: 18px;
`;

const Links = styled.div`
  display: flex;
  align-items: center;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 0 ${units.margin};
`;

const WithPadding = styled.div`
  padding-left: ${units.padding};
`;

const Note = styled.div`
  ${mediaQueries};
  border-radius: 5px;
  border: 1px solid white;
  padding: 0 ${units.paddingSmall};
  margin: 0 0 0 ${units.margin};
  color: ${props => (props.note >= 0 ? colors.success : colors.error)};
  background: white;
  user-select: none;
`;

const CustomLinks = styled(Link)`
  ${mediaQueries};
  margin: 0 ${units.marginSmall};
  color: white;
  border-bottom: 1px solid white;
  text-decoration: none;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.primary};
    border-bottom: 1px solid ${colors.primary};
  }
`;

const Logo = styled.div`
  padding-left: ${units.padding};
  flex: 1;
`;

export default props => {
  const isAuthenticated = auth.isAuthenticated();
  const user = auth.getUser();
  return (
    <Toolbar>
      <Logo>Dotabook</Logo>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <Links>
          <CustomLinks to="/home">Home</CustomLinks>
          <CustomLinks to="/search/user">Search</CustomLinks>
          <Note note={user.note} data-tip data-for="note">
            {user.note}
            <ReactTooltip id="note" place="bottom" type="info" effect="solid">
              <span>User behaviour note</span>
            </ReactTooltip>
          </Note>
          <Profile>
            <FaUser size={'1.5rem'} />
            <WithPadding>{user.username}</WithPadding>
          </Profile>
          <ToolbarMenu />
        </Links>
      )}
    </Toolbar>
  );
};
