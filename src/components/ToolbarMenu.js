import React from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import LogoutModal from './LogoutModal';
import { FaEllipsisV } from 'react-icons/fa';

const Icon = styled(FaEllipsisV)`
  cursor: pointer;
  position: relative;
  width: 25px;
  margin: 0 25px;
  display: flex;
  justify-content: center;
`;

export default class Login extends React.PureComponent {
  node = null;

  state = {
    isModalOpened: false,
  };

  componentDidMount = () => {
    document.addEventListener('mousedown', this.handleClick, false);
  };
  componentWillUnMount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
  };

  handleClick = event => {
    if (this.node.contains(event.target)) {
      return;
    }
    this.toggleModal(false);
  };

  toggleModal = isOpen => {
    this.setState({ isModalOpened: isOpen });
  };

  render() {
    const { isModalOpened } = this.state;
    return (
      <>
        <div ref={node => (this.node = node)}>
          <Modal isOpen={isModalOpened}>
            <LogoutModal toggleModal={this.toggleModal} />
          </Modal>
        </div>
        <Icon onClick={() => this.toggleModal(!isModalOpened)} />
      </>
    );
  }
}
