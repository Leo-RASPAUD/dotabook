import React from 'react';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
  align-items: ${props => (props.center ? 'center' : 'inherit')};
`;

export default ({ children, margin, center }) => (
  <Flex margin={margin} center={center}>
    {children}
  </Flex>
);
