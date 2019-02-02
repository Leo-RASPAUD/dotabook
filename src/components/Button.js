import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import units from '../constants/units';
import transitions from '../constants/transitions';

const Button = styled.button`
  display: flex;
  align-items: center;
  border: ${props => (props.noBorder ? 'none' : `1px solid ${colors.primary}`)};
  padding: ${units.paddingSmall} ${units.padding};
  border-radius: 5px;
  margin: ${props => props.margin || `0 ${units.margin} 0 0`}
  background-color: ${props =>
    props.transparent ? 'transparent' : props.disabled ? 'gray' : props.variant === 'primary' ? colors.primary : 'red'};
  text-transform: uppercase;
  pointer-events: ${props => (props.disabled ? 'none' : 'inherit')}
  transition: ${transitions.short};
  color: white;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.hoverText ? '' : props.variant === 'primary' ? colors.primary600 : 'red')};
    color: ${props => (props.hoverText ? colors.primary : '')}
  }
`;

export default ({
  children,
  onClick,
  variant,
  disabled,
  transparent = false,
  noBorder = false,
  hoverText,
  margin = null,
}) => (
  <Button variant={variant} onClick={onClick} disabled={disabled} transparent noBorder hoverText margin={margin}>
    {children}
  </Button>
);
