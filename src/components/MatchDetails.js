import React from 'react';
import styled from 'styled-components';
import { Animate } from 'react-simple-animate';
import Loader from './Loader';
import Team from './Team';
import units from '../constants/units';
import colors from '../constants/colors';
import media from '../constants/media';

const mediaQueries = `
@media ${media.fromXsmallScreen} {
  display: none;
}

@media ${media.fromMediumScreen} {
  display: flex;
}`;

const Root = styled.div`
  ${mediaQueries}
  padding: ${units.padding};
  flex-direction: column;
  align-items: center;
  height: 450px;
`;

const LoaderWrapper = styled.div`
  padding: ${units.padding};
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Victory = styled.div`
  font-size: 30px;
  color: white;
  text-shadow: 0px 0px 20px ${props => (props.hasRadiantWon ? colors.error : colors.success)};
  text-transform: uppercase;
`;

const Teams = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Separator = styled.hr`
  width: 50%;
  border: 1px solid #0f3c62;
`;

const Score = styled.div`
  font-size: 24px;
`;

class MatchDetails extends React.PureComponent {
  render() {
    if (media.isMobileScreen) return null;
    const { loadingDetails, data, updateNote, loadPlayerDetails } = this.props;
    if (!data || loadingDetails || data.players.length === 0) {
      return (
        <LoaderWrapper>
          <Loader message={'Loading match details'} />
        </LoaderWrapper>
      );
    }

    const { players } = data;
    const dire = players.filter(player => !player.isRadiant);
    const radiant = players.filter(player => player.isRadiant);

    return (
      <Animate
        play
        startStyle={{ opacity: 0 }}
        endStyle={{ opacity: 1 }}
        render={() => (
          <Root>
            <Victory hasRadiantWon={data.radiant_win}>{data.radiant_win ? 'Radiant' : 'Dire'} victory</Victory>
            <Score>
              {data.dire_score} - {data.radiant_score}
            </Score>
            <Teams>
              <Team teamName="Dire" players={dire} updateNote={updateNote} loadPlayerDetails={loadPlayerDetails} />
              <Team
                teamName="Radiant"
                players={radiant}
                updateNote={updateNote}
                loadPlayerDetails={loadPlayerDetails}
              />
            </Teams>
            <Separator />
          </Root>
        )}
      />
    );
  }
}

export default MatchDetails;
