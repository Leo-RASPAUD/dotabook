import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import auth from '../utils/auth';
import SteamSvg from './SteamSvg';
import { Redirect } from 'react-router';
import constants from '../constants/constants';
import transitions from '../constants/transitions';
import authUtils from '../utils/auth';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from '../mutations/User';
import queries from '../queries/User';

const Button = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.primary};
  padding: ${units.paddingSmall} ${units.padding};
  border-radius: 5px;
  margin-right: ${units.margin};
  background-color: ${props => (props.variant === 'primary' ? colors.primary : 'red')};
  text-transform: uppercase;
  transition: ${transitions.short};
  color: white;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.variant === 'primary' ? colors.primary600 : 'red')};
  }
`;

export default ({ children, onClick, variant }) => (
  <Button variant={variant} onClick={onClick}>
    {children}
  </Button>
);
