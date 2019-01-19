import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import queries from '../queries/Matches';
import auth from '../utils/auth';
import MatchDetails from './MatchDetails';
import DropdownDisplayCount from './DropdownDisplayCount';
import MatchHistoryComponent from './MatchHistoryComponent';
import mutations from '../mutations/User';

class MatchHistory extends React.PureComponent {
  state = {
    offset: 0,
    limit: 10,
    matches: [],
    loading: true,
    loadingDetails: false,
    matchDetails: null,
  };

  componentDidMount = async () => {
    const { offset, limit } = this.state;
    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), limit, offset }));
    this.setState({ matches, loading: false });
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
    await this.setState({ loadingDetails: true });
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
              note: results.updatedNote,
            };
          }
          return player;
        }),
      },
    });
  };

  render() {
    const { matches, loading, offset, limit, matchDetails, loadingDetails } = this.state;
    if (loading) {
      return <div>Loading matches...</div>;
    }
    return (
      <div>
        {matchDetails && (
          <MatchDetails data={matchDetails} loadingDetails={loadingDetails} updateNote={this.updateNote} />
        )}
        <DropdownDisplayCount onChange={this.changeNumberDisplayed} limit={limit} />
        <MatchHistoryComponent matches={matches} getMatchDetails={this.getMatchDetails} />
        <button onClick={() => this.loadData({ isNext: false })} disabled={offset === 0}>
          Previous page
        </button>
        <button onClick={() => this.loadData({ isNext: true })}>Next page</button>
      </div>
    );
  }
}

export default MatchHistory;
