import React from 'react';
import styled from 'styled-components';
import Loader from './Loader';
import Team from './Team';
import units from '../constants/units';
import { Animate } from 'react-simple-animate';

const Root = styled.div`
  margin: ${units.margin} 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 350px;
`;

const LoaderWrapper = styled.div`
  margin: ${units.margin} 0;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Victory = styled.div``;

const Teams = styled.div`
  display: flex;
  justify-content: space-around;
`;

class MatchDetails extends React.PureComponent {
  render() {
    const { loadingDetails, data, updateNote } = this.props;
    if (!data || loadingDetails || data.players.length === 0) {
      return (
        <LoaderWrapper>
          <Animate play startStyle={{ opacity: 0 }} endStyle={{ opacity: 1 }}>
            <Loader message={'Loading match details'} />
          </Animate>
        </LoaderWrapper>
      );
    }

    console.log(data);
    const { players } = data;
    const dire = players.filter(player => !player.isRadiant);
    const radiant = players.filter(player => player.isRadiant);

    return (
      <Animate play startStyle={{ opacity: 0 }} endStyle={{ opacity: 1 }}>
        <Root>
          <Victory>{data.radiant_win ? 'Radiant' : 'Dire'} victory</Victory>
          <Teams>
            <Team teamName="Dire" players={dire} updateNote={updateNote} />
            <Team teamName="Radiant" players={radiant} updateNote={updateNote} />
          </Teams>
        </Root>
      </Animate>
    );
  }
}

export default MatchDetails;
