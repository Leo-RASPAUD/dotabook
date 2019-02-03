import React from 'react';
import styled from 'styled-components';
import { Animate } from 'react-simple-animate';
import Loader from './Loader';
import Team from './Team';
import units from '../constants/units';
import colors from '../constants/colors';

const Root = styled.div`
  padding: ${units.padding};
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 400px;
`;

const LoaderWrapper = styled.div`
  padding: ${units.padding};
  height: 400px;
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
    const { loadingDetails, data, updateNote } = this.props;
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
              <Team teamName="Dire" players={dire} updateNote={updateNote} />
              <Team teamName="Radiant" players={radiant} updateNote={updateNote} />
            </Teams>
            <Separator />
          </Root>
        )}
      />
    );
  }
}

export default MatchDetails;
