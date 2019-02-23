import React from 'react';
import styled from 'styled-components';
import DropdownDisplayCount from './DropdownDisplayCount';
import Flex from './commons/Flex';
import units from '../constants/units';
import { FaSyncAlt } from 'react-icons/fa';
import Button from './commons/Button';
import ReactTooltip from 'react-tooltip';
import media from '../constants/media';
import MatchesTable from './MatchesTable';

const mediaQueries = `
@media ${media.fromXsmallScreen} {
  display: none;
}

@media ${media.fromMediumScreen} {
  display: flex;
}`;

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin: ${units.marginSmall};
`;

const Root = styled.div`
  ${mediaQueries};
  align-items: stretch;
  flex-direction: column;
  margin-bottom: ${units.margin};
`;
class MatchHistoryComponent extends React.PureComponent {
  render() {
    const { matches, getMatchDetails, selectedMatchId, loadData, changeNumberDisplayed, offset, limit } = this.props;
    return (
      <Root>
        <Flex margin={`${units.marginSmall} 0`}>
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
        <MatchesTable
          matches={matches}
          getMatchDetails={getMatchDetails}
          readOnly={false}
          selectedMatchId={selectedMatchId}
        />
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
