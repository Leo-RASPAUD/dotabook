import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import styled from 'styled-components';
import queries from '../queries/Matches';
import auth from '../utils/auth';
import MatchDetails from './MatchDetails';
import DropdownDisplayCount from './DropdownDisplayCount';
import Loader from './Loader';
import MatchHistoryComponent from './MatchHistoryComponent';
import mutations from '../mutations/User';
import units from '../constants/units';
import { Animate } from 'react-simple-animate';

const Root = styled.div`
  display: flex;
  margin-top: ${units.margin};
`;

const HistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: ${units.margin};
`;

class MatchHistory extends React.PureComponent {
  state = {
    offset: 0,
    limit: 10,
    matches: [],
    loading: true,
    loadingDetails: false,
    matchDetails: null,
    selectedMatchId: null,
  };

  componentDidMount = async () => {
    const { offset, limit } = this.state;
    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), limit, offset }));
    if (matches.length > 0) {
      const lastMatchId = matches[0].match_id;
      await this.setState({ matches, loading: false, selectedMatchId: lastMatchId });
      this.getMatchDetails({ id: lastMatchId });
    }
  };

  loadData = async ({ isNext }) => {
    this.setState({ loading: true });
    const { offset, limit } = this.state;
    const newOffset = isNext ? offset + limit : offset - limit;
    const {
      data: { getMatches: matches },
    } = await API.graphql(
      graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), offset: newOffset, limit }),
    );
    this.setState({ offset: newOffset, matches, loading: false });
  };

  changeNumberDisplayed = async event => {
    const limit = event.target.value;
    await this.setState({ limit, loading: true, matchDetails: null });
    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), offset: 0, limit }));
    this.setState({ matches, loading: false, offset: 0, limit });
  };

  getMatchDetails = async ({ id }) => {
    await this.setState({ loadingDetails: true, selectedMatchId: id });
    const {
      data: { getMatchDetails: data },
    } = await API.graphql(graphqlOperation(queries.getMatchDetails, { matchId: id, currentUserId: auth.getUserId() }));
    this.setState({ loadingDetails: false, matchDetails: data });
  };

  updateNote = async ({ isNotePlus, accountId }) => {
    const { players } = this.state.matchDetails;
    const {
      data: { updateNote: results },
    } = await API.graphql(
      graphqlOperation(mutations.updateNote, { isNotePlus, accountId, currentUserId: auth.getUserId() }),
    );
    this.setState({
      matchDetails: {
        players: players.map(player => {
          if (player.account_id === accountId) {
            return {
              ...player,
              alreadyNoted: results.updatedNotedUsers.find(a => a.id === '' + player.account_id) ? true : false,
              note: results.updatedNote,
            };
          }
          return player;
        }),
      },
    });
  };

  render() {
    const { matches, loading, offset, limit, matchDetails, loadingDetails, selectedMatchId } = this.state;
    return (
      <Root>
        {loading && (
          <div>
            <div>Loading matches...</div>
            <Loader />
          </div>
        )}
        {!loading && (
          <Animate play startStyle={{ opacity: 0 }} endStyle={{ opacity: 1 }}>
            <Root>
              <HistoryWrapper>
                <DropdownDisplayCount onChange={this.changeNumberDisplayed} limit={limit} />
                <MatchHistoryComponent
                  matches={matches}
                  getMatchDetails={this.getMatchDetails}
                  selectedMatchId={selectedMatchId}
                />
                <button onClick={() => this.loadData({ isNext: false })} disabled={offset === 0}>
                  Previous page
                </button>
                <button onClick={() => this.loadData({ isNext: true })}>Next page</button>
              </HistoryWrapper>
              <MatchDetails data={matchDetails} loadingDetails={loadingDetails} updateNote={this.updateNote} />
            </Root>
          </Animate>
        )}
      </Root>
    );
  }
}

export default MatchHistory;
