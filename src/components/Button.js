import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import transitions from '../constants/transitions';

const Button = styled.button`
  display: flex;
  align-items: center;
  border: 1px solid ${colors.primary};
  padding: ${units.paddingSmall} ${units.padding};
  border-radius: 5px;
  margin-right: ${units.margin};
  background-color: ${props => (props.disabled ? 'gray' : props.variant === 'primary' ? colors.primary : 'red')};
  text-transform: uppercase;
  pointer-events: ${props => (props.disabled ? 'none' : 'inherit')}
  transition: ${transitions.short};
  color: white;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.variant === 'primary' ? colors.primary600 : 'red')};
  }
`;

export default ({ children, onClick, variant, disabled }) => (
  <Button variant={variant} onClick={onClick} disabled={disabled}>
    {children}
  </Button>
);
