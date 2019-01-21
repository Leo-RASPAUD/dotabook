import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';

const InputWrapper = styled.div`
  flex-direction: column;
  width: 280px;
`;

const Label = styled.label`
  font-size: 30px;
  margin-bottom: 30px;
  font-weight: 300;
  text-transform: none;
  color: ${colors.white};
`;

const TextInput = styled.input`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  width: 240px;
`;

const SubmitInput = styled.input`
  width: 100%;
  margin-top: 25px;
  font-size: 15px;
  padding: 8px 31px;
  border-radius: 5px;
  -webkit-appearance: none;
  background: #0097fa;
  color: white;
  border: none;
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
          <TextInput type="text" id={id} onChange={this.updateInput} onKeyPress={this.onKeyPress} />
          <SubmitInput
            type="submit"
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
