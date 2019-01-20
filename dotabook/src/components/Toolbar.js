import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import auth from '../utils/auth';

const Toolbar = styled.div`
  height: 50px;
  background-color: ${colors.white};
  border-bottom: 1px solid rgba(128, 128, 128, 0.5);
  margin-bottom: ${units.margin};
  display: flex;
  align-items: center;
  padding-left: ${units.padding};
`;

export default props => {
  if (!auth.isAuthenticated()) {
    return null;
  }

  return <Toolbar>Dotabook</Toolbar>;
};
