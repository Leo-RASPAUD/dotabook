import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from './commons/Modal';
import MoreMenu from './MoreMenu';
import { FaEllipsisV } from 'react-icons/fa';

const Icon = styled(FaEllipsisV)`
  cursor: pointer;
  position: relative;
  width: 25px;
  margin: 0 25px;
  display: flex;
  justify-content: center;
`;

let node = null;

export default () => {
  const [isModalOpened, setModalOpened] = useState(false);

  const handleClick = event => {
    if (node.contains(event.target)) {
      return;
    }
    setModalOpened(false);
  };

  const toggleModal = isOpen => {
    setModalOpened(isOpen);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false);
    return () => {
      document.removeEventListener('mousedown', handleClick, false);
    };
  });

  return (
    <>
      <div ref={theNode => (node = theNode)}>
        <Modal isOpen={isModalOpened}>
          <MoreMenu toggleModal={toggleModal} />
        </Modal>
      </div>
      <Icon onClick={() => toggleModal(!isModalOpened)} />
    </>
  );
};
