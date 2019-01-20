import React from 'react';
import styled from 'styled-components';

import { FaSearch } from 'react-icons/fa';

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export default class SearchInput extends React.PureComponent {
  state = {
    inputValue: '',
  };

  updateInput = event => {
    this.setState({ inputValue: event.target.value });
  };

  render() {
    const { inputValue } = this.state;
    const { searchFunction } = this.props;
    return (
      <InputWrapper>
        <input type="text" onChange={this.updateInput} />
        <FaSearch onClick={() => searchFunction(inputValue)} />
      </InputWrapper>
    );
  }
}
