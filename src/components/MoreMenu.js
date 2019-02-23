import React from 'react';
import styled from 'styled-components';
import units from '../constants/units';
import { FaSignOutAlt, FaHome, FaSearch, FaInfo } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import auth from '../utils/auth';
import transitions from '../constants/transitions';
import colors from '../constants/colors';
import media from '../constants/media';
import steam from '../utils/steam';

const mediaQueries = `
@media ${media.fromXsmallScreen} {
  display: flex;
}

@media ${media.fromMediumScreen} {
  display: none;
}`;

const MenuItem = styled.div`
  ${props => (props.alwaysDisplay ? '' : mediaQueries)};
  padding: ${units.padding};
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: ${transitions.short};
  &:hover {
    background: ${colors.primary800};
  }
`;

const WithMargin = styled.div`
    margin-right: ${units.marginSmall};''
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

export default class MoreMenu extends React.PureComponent {
  logout = () => {
    auth.removeUser();
    window.location.replace('/login');
  };

  render() {
    const { toggleModal } = this.props;
    const userId = auth.getUserId();
    return (
      <div>
        <MenuItem onClick={() => toggleModal(false)}>
          <WithMargin>
            <FaHome />
          </WithMargin>
          <CustomLink to="/home">Home</CustomLink>
        </MenuItem>
        <MenuItem onClick={() => toggleModal(false)}>
          <WithMargin>
            <FaSearch />
          </WithMargin>
          <CustomLink to="/search/user">Search</CustomLink>
        </MenuItem>
        <MenuItem
          onClick={() => {
            window.open(
              `https://steamcommunity.com/profiles/${steam.convertSteamId64(
                userId,
              )}/gcpd/570?category=Account&tab=MatchPlayerReportIncoming`,
            );
          }}
          alwaysDisplay
        >
          <WithMargin>
            <FaInfo />
          </WithMargin>
          <div>Check reports</div>
        </MenuItem>
        <MenuItem onClick={this.logout} alwaysDisplay>
          <WithMargin>
            <FaSignOutAlt />
          </WithMargin>
          <div>Logout</div>
        </MenuItem>
      </div>
    );
  }
}
