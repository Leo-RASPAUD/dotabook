import React from 'react';
import styled from 'styled-components';
import units from '../../constants/units';

const Flex = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
  align-items: ${props => (props.alignItems ? props.alignItems : 'inherit')};
  width: ${props => (props.full ? '100%' : 'inherit')};
  padding: ${props => (props.withPadding ? units.padding : 0)};
  justify-content: ${props => (props.justify ? props.justify : 'inherit')};
  flex-direction: ${props => (props.column ? 'column' : 'row')};
`;

export default ({ children, margin, alignItems, full, withPadding, spaceAround, column = false, justify }) => (
  <Flex
    margin={margin}
    alignItems={alignItems}
    full={full}
    withPadding={withPadding}
    spaceAround={spaceAround}
    column={column}
    justify={justify}
  >
    {children}
  </Flex>
);
