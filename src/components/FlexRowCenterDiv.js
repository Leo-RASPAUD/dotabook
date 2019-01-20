import React from 'react';
import styled from 'styled-components';

const FlexRowCenterDiv = styled.div`
  display: flex;
  justify-content: center;
`;

export default ({ children }) => <FlexRowCenterDiv>{children}</FlexRowCenterDiv>;
