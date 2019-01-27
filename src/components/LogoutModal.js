import React from 'react';
import styled from 'styled-components';
import units from '../constants/units';
import { FaSignOutAlt } from 'react-icons/fa';
import auth from '../utils/auth';

const Logout = styled.div`
  padding: ${units.padding};
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const Icon = styled(FaSignOutAlt)`
    margin-right: ${units.marginSmall};''
`;

export default class LogoutModal extends React.PureComponent {
  logout = () => {
    auth.removeUser();
    window.location.replace('/login');
  };

  render() {
    return (
      <Logout onClick={this.logout}>
        <Icon />
        <div>Logout</div>
      </Logout>
    );
  }
}
