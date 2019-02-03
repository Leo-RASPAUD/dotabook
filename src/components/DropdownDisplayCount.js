import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import transitions from '../constants/transitions';
import colors from '../constants/colors';

const Select = styled.select`
  height: 26px;
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  width: 75px;
  background: none;
  border: 1px solid ${colors.primary};
  color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: ${transitions.short};
  :hover {
    background-color: ${colors.primary800};
  }
`;

const Option = styled.option`
  font-weight: 500;
  font-family: 'Roboto', sans-serif;
  background: black;
  border: none;
  color: white;
`;

export default ({ onChange, limit }) => (
  <div data-tip data-for="items-displayed">
    <Select onChange={onChange} value={limit}>
      <Option value="10">10</Option>
      <Option value="25">25</Option>
      <Option value="50">50</Option>
    </Select>
    <ReactTooltip id="items-displayed" place="top" type="info" effect="solid">
      <span>Items displayed</span>
    </ReactTooltip>
  </div>
);
