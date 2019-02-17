import React from 'react';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import time from '../utils/time';
import colors from '../constants/colors';
import { SimpleImg } from 'react-simple-img';
import DropdownDisplayCount from './DropdownDisplayCount';
import Flex from './Flex';
import units from '../constants/units';
import { FaSyncAlt } from 'react-icons/fa';
import Button from './Button';
import ReactTooltip from 'react-tooltip';
import transitions from '../constants/transitions';
import matchUtils from '../utils/matches';
import media from '../constants/media';

const mediaQueries = `
@media ${media.fromXsmallScreen} {
  display: none;
}

@media ${media.fromMediumScreen} {
  display: flex;
}`;

const Data = styled.td`
  min-width: 150px;
  text-align: center;
  text-transform: uppercase;
  color: ${props => (!props.status ? colors.white : props.isWon ? colors.success : colors.error)};
`;

const Table = styled.table`
  border-collapse: collapse;

  & th {
    font-weight: 500;
    background: none;
  }
  & tr {
    transition: ${transitions.default};
    cursor: pointer;
    :hover {
      background-color: #0d47a15e;
    }
  }
  & tr td,
  th {
    box-shadow: 0 2px 0 0 #2196f35c;
    padding: 10px;
  }
`;

const MatchId = styled.div`
  font-size: 12px;
  opacity: 0.75;
  text-align: left;
  margin-bottom: 5px;
`;

const TextAlignLeft = styled.div`
  text-align: left;
`;

const RowWrapper = styled.tr`
  background-color: ${props => (props.isSelected ? 'rgba(33, 150, 243, 0.25)' : 'none')};
`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin: ${units.marginSmall};
`;

const Root = styled.div`
  ${mediaQueries}
  align-items: stretch;
  flex-direction: column;
  margin-bottom: ${units.margin};
`;
class MatchHistoryComponent extends React.PureComponent {
  render() {
    const { matches, getMatchDetails, selectedMatchId, loadData, changeNumberDisplayed, offset, limit } = this.props;
    const wonCount = matchUtils.getMatchesWonCount(matches);
    const matchCount = matches.length;
    const killsAverage = (matches.reduce((a, b) => a + b.kills, 0) / matchCount).toFixed(2);
    const deathsAverage = (matches.reduce((a, b) => a + b.deaths, 0) / matchCount).toFixed(2);
    const assitsAverage = (matches.reduce((a, b) => a + b.assists, 0) / matchCount).toFixed(2);
    return (
      <Root>
        <Flex margin={`${units.marginSmall} 0`} center>
          <DropdownDisplayCount onChange={changeNumberDisplayed} limit={limit} />
          <div data-tip data-for="refresh">
            <Button
              margin={`0 ${units.marginSmall}`}
              transparent
              noBorder
              onClick={() => loadData({ isRefresh: true })}
              hoverText
            >
              <FaSyncAlt />
            </Button>
          </div>
          <ReactTooltip id="refresh" place="top" type="info" effect="solid">
            Refresh
          </ReactTooltip>
        </Flex>
        <Table>
          <thead>
            <tr>
              <th>Hero</th>
              <th>Date</th>
              <th>{`Result ( W:${wonCount} / L:${matches.length - wonCount} )`}</th>
              <th>Duration</th>
              <th>{`K (${killsAverage}) / D (${deathsAverage}) / A (${assitsAverage})`}</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => {
              const date = fromUnixTime(match.start_time);
              const isRadiant = match.player_slot < 128;
              const isWon = matchUtils.isMatchWon(match.radiant_win, isRadiant);
              return (
                <RowWrapper
                  key={match.match_id}
                  onClick={() => getMatchDetails({ id: match.match_id })}
                  isSelected={selectedMatchId === match.match_id}
                >
                  <td>
                    <SimpleImg
                      height={50}
                      width={100}
                      src={`https://api.opendota.com${match.hero.img}`}
                      placeholder={'#050911'}
                    />
                  </td>
                  <Data>
                    <MatchId>{match.match_id}</MatchId>
                    <TextAlignLeft>{format(date, 'dd/MM/yyyy kk:mm')}</TextAlignLeft>
                  </Data>
                  <Data status isWon={isWon}>
                    {isWon ? 'Won match' : 'Lost match'}
                  </Data>
                  <Data>{time.secondsToHms(match.duration)}</Data>
                  <Data>
                    {match.kills} / {match.deaths} / {match.assists}
                  </Data>
                </RowWrapper>
              );
            })}
          </tbody>
        </Table>
        <Buttons>
          <Button
            transparent
            noBorder
            hoverText
            bigText
            onClick={() => loadData({ isFirst: true })}
            disabled={offset === 0}
          >
            First
          </Button>
          <Button
            transparent
            noBorder
            hoverText
            bigText
            onClick={() => loadData({ isNext: false })}
            disabled={offset === 0}
          >
            {'<'}
          </Button>
          <Button transparent noBorder hoverText bigText onClick={() => loadData({ isNext: true })}>
            {'>'}
          </Button>
        </Buttons>
      </Root>
    );
  }
}

export default MatchHistoryComponent;
