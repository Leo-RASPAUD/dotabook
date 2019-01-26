import React from 'react';
import styled from 'styled-components';
import colors from '../constants/colors';
import transitions from '../constants/transitions';
import { FaTimes } from 'react-icons/fa';

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
  background: ${colors.primary};
  transition: ${transitions.short};
  color: white;
  border: none;

  &:hover {
    background-color: ${colors.primary600};
  }
`;

const TextWrapper = styled.div`
  position: relative;
`;

const ClearIcon = styled.div`
  position: absolute;
  top: 5px;
  color: ${colors.error}
  right: 10px;
  cursor: pointer;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.error800}
  }
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

  clearFunction = () => {
    const { clear } = this.props;
    clear();
    this.setState({ inputValue: '' });
  };

  render() {
    const { inputValue } = this.state;
    const isTyped = inputValue.length > 0;
    const { searchFunction, id, label, displayClear } = this.props;
    return (
      <>
        <Label htmlFor={id}>{label}</Label>
        <InputWrapper>
          <TextWrapper>
            <TextInput
              type="text"
              id={id}
              onChange={this.updateInput}
              onKeyPress={this.onKeyPress}
              value={inputValue}
            />
            {(isTyped || displayClear) && (
              <ClearIcon onClick={this.clearFunction}>
                <FaTimes size={'1.5rem'} />
              </ClearIcon>
            )}
          </TextWrapper>
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
