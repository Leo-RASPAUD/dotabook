import React from 'react';
import styled from 'styled-components';
import units from '../constants/units';

const Flex = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
  align-items: ${props => (props.center ? 'center' : 'inherit')};
  width: ${props => (props.full ? '100%' : 'inherit')};
  padding: ${props => (props.withPadding ? units.padding : 0)};
  justify-content: ${props => (props.spaceAround ? 'space-around' : 'inherit')};
  flex-direction: ${props => (props.row ? 'row' : 'column')};
`;

export default ({ children, margin, center, full, withPadding, spaceAround, row }) => (
  <Flex margin={margin} center={center} full={full} withPadding={withPadding} spaceAround={spaceAround} row={row}>
    {children}
  </Flex>
);
