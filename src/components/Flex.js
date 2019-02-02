import React from 'react';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  margin: ${props => props.margin || 0};
`;

export default ({ children, margin }) => <Flex margin={margin}>{children}</Flex>;
