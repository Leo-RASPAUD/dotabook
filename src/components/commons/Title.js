import React from 'react';
import styled from 'styled-components';
import colors from '../../constants/colors';

const Title = styled.div`
  font-size: 24px;
  width: 100%;
  border-bottom: 1px solid ${colors.primary100};
`;

export default ({ children }) => <Title>{children}</Title>;
