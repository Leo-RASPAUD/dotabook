import React from 'react';
import styled from 'styled-components';
import units from '../../constants/units';

const Flex = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
  align-items: ${props => (props.alignItems ? props.alignItems : '')};
  width: ${props => (props.width ? props.width : props.full ? '100%' : '')};
  max-width: ${props => (props.maxWidth ? props.maxWidth : '')};
  padding: ${props => (props.padding ? props.padding : props.withPadding ? units.padding : 0)};
  justify-content: ${props => (props.justify ? props.justify : '')};
  flex-direction: ${props => (props.column ? 'column' : 'row')};
`;

export default ({
  children,
  margin,
  alignItems,
  full,
  withPadding,
  spaceAround,
  column = false,
  justify,
  width,
  maxWidth,
  padding,
}) => (
  <Flex
    margin={margin}
    alignItems={alignItems}
    full={full}
    withPadding={withPadding}
    spaceAround={spaceAround}
    column={column}
    justify={justify}
    width={width}
    maxWidth={maxWidth}
    padding={padding}
  >
    {children}
  </Flex>
);
