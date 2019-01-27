import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import auth from '../utils/auth';
import Login from './Login';

const Toolbar = styled.div`
  color: ${colors.white}
  height: 50px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  margin-bottom: ${units.marginSmall};
  display: flex;
  align-items: center;
  padding-left: ${units.padding};
`;

export default props => {
  const isAuthenticated = auth.isAuthenticated();
  const user = auth.getUser();
  return (
    <Toolbar>
      <div style={{ flex: 1 }}>Dotabook</div>
      {!isAuthenticated && <Login />}
      {isAuthenticated && (
        <div>
          <div>Search</div>
          <div>{user.username}</div>
          <div>{user.note}</div>
        </div>
      )}
    </Toolbar>
  );
};
