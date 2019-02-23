import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import { SimpleImg } from 'react-simple-img';
import ReactTooltip from 'react-tooltip';
import colors from '../constants/colors';
import Flex from './commons/Flex';
import Title from './commons/Title';
import { FaRegCalendarAlt } from 'react-icons/fa';
import units from '../constants/units';
import media from '../constants/media';

const Root = styled.div`
  width: 100%;
  @media ${media.fromMediumScreen} {
    max-width: 400px;
  }
`;

const Data = styled.div`
  @media ${media.fromMediumScreen} {
    font-size: 12px;
  }
`;

const Name = styled.div`
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PeersTable = ({ peers }) => {
  return (
    <Root>
      <Flex column withPadding full>
        <Title>Peers</Title>

        {peers.map(peer => {
          const date = fromUnixTime(peer.last_played);
          return (
            <Flex withPadding key={peer.account_id} alignItems="center">
              <div>
                <SimpleImg width={25} height={25} src={peer.avatarfull} placeholder={'#050911'} />
              </div>
              <Flex column justify="start" margin={`0 0 0 ${units.marginSmall}`} full>
                <Flex justify="space-between">
                  <Name>{peer.personaname}</Name>
                  <FaRegCalendarAlt color={colors.primary} data-tip data-for={`${peer.account_id}-profile`} />
                  <ReactTooltip id={`${peer.account_id}-profile`} place="right" type="info" effect="solid">
                    <span>Last played: {format(date, 'dd/MM/yyyy kk:mm')}</span>
                  </ReactTooltip>
                </Flex>
                <Data>
                  <span style={{ color: colors.success }}>{peer.with_win} / </span>
                  <span style={{ color: colors.error }}>{peer.with_games - peer.with_win}</span>
                </Data>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </Root>
  );
};
export default PeersTable;
