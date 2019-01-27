import React from 'react';
import styled from 'styled-components';
import MenuModal from './MenuModal';
import LogoutModal from './LogoutModal';
import transitions from '../constants/transitions';
import colors from '../constants/colors';
import { FaEllipsisV } from 'react-icons/fa';

const Root = styled.div`
  position: relative;
  width: 75px;
  display: flex;
  justify-content: center;
  transition: ${transitions.default};
  &:hover {
    color: ${colors.primary};
  }
`;

const Icon = styled(FaEllipsisV)`
  cursor: pointer;
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
          <MenuModal isOpen={isModalOpened}>
            <LogoutModal />
          </MenuModal>
        </div>
        <Root>
          <Icon onClick={() => this.toggleModal(!isModalOpened)} />
        </Root>
      </>
    );
  }
}
