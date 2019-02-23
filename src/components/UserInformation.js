import React from 'react';
import styled from 'styled-components';
import { SimpleImg } from 'react-simple-img';
import Flex from './commons/Flex';
import colors from '../constants/colors';
import media from '../constants/media';
import units from '../constants/units';

const Text = styled.div`
  font-size: 20px;
  text-shadow: 0px 0px 20px ${colors.success};
  margin-top: ${props => (props.noMargin ? 0 : units.margin)};

  @media ${media.fromMediumScreen} {
    font-size: 30px;
    margin-top: 0;
  }
`;

const SubDetails = styled.div`
  margin-top: ${units.marginSmall};
  display: flex;
  flex-direction: column;

  @media ${media.fromMediumScreen} {
    margin-top: 0;
  }
`;

const SubText = styled.div`
  font-size: 16px;
  text-shadow: 0px 0px 20px ${colors.success};

  @media ${media.fromMediumScreen} {
    font-size: 26px;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  min-height: 350px;

  @media ${media.fromMediumScreen} {
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    min-height: inherit;
  }
`;

const BestHero = styled.div`
  display: none;
  @media ${media.fromMediumScreen} {
    display: block;
    margin-right: ${units.margin};
  }
`;

const UserInformation = ({ user, userStats }) => {
  return (
    <Root>
      <div>
        <SimpleImg width={150} height={150} src={user.avatar} placeholder={'#050911'} />
      </div>

      <Flex column>
        <Text>
          {user.username} - {user.note}
        </Text>
        <SubDetails>
          <SubText>
            <span style={{ color: colors.success }}>{userStats.matchesWon}</span> /{' '}
            <span style={{ color: colors.error }}>{userStats.matchesLost}</span>
          </SubText>
          <SubText>Current winning streak: {userStats.currentWinStreak}</SubText>
        </SubDetails>
      </Flex>
      <Flex alignItems="center">
        <BestHero>
          <SimpleImg
            width={100}
            height={50}
            src={`https://api.opendota.com${userStats.bestHero.img}`}
            placeholder={'#050911'}
          />
        </BestHero>
        <Flex column>
          <Text>Best hero</Text>
          <Text noMargin>
            {userStats.bestHero.localized_name} ({(userStats.bestHero.winrate * 100).toFixed(1)}% over{' '}
            {userStats.bestHero.games} games)
          </Text>
        </Flex>
      </Flex>
    </Root>
  );
};

export default UserInformation;
