import React from 'react';
import styled from 'styled-components';
import transitions from '../constants/transitions';
import colors from '../constants/colors';

const Modal = styled.div`
  border-radius: 5px;
  border: 1px solid ${colors.primary}
  width: 200px;
  background: black;
  z-index: ${props => (props.isOpen ? 1 : -1)};
  position: absolute;
  top: 50px;
  right: 10px;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: ${transitions.default};
  color: white;

  &:before {
    content: '';
    border-style: solid;
    border-width: 10px 10px 10px 10px;
    border-color: transparent ${colors.primary} transparent transparent;
    position: absolute;
    top: -20px;
    transform: rotate(90deg);
    right: 18px;
  }


  &:hover {
      background: ${colors.primary800};
  }
`;

export default class Login extends React.PureComponent {
  render() {
    const { isOpen, children } = this.props;
    return <Modal isOpen={isOpen}>{children}</Modal>;
  }
}
