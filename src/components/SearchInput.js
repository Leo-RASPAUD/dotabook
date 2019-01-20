import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import colors from '../constants/colors';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.label`
      margin-bottom: 10px;
    text-transform: none;
    color: ${colors.primary}
    filter: grayscale(50%);
    font-size: 25px;
`;

export default class SearchInputClass extends React.PureComponent {
  state = {
    inputValue: '',
  };

  updateInput = event => {
    this.setState({ inputValue: event.target.value });
  };

  onKeyPress = event => {
    const { inputValue } = this.state;
    const { searchFunction } = this.props;
    if (event.key === 'Enter' && inputValue.length > 0) {
      searchFunction(inputValue);
    }
  };

  render() {
    const { inputValue } = this.state;
    const { searchFunction, id, label } = this.props;
    return (
      <>
        <Label htmlFor={id}>{label}</Label>
        <InputWrapper>
          <input type="text" id={id} onChange={this.updateInput} onKeyPress={this.onKeyPress} />
          <FaSearch
            onClick={() => {
              if (inputValue.length === 0) return;
              searchFunction(inputValue);
            }}
          />
        </InputWrapper>
      </>
    );
  }
}
