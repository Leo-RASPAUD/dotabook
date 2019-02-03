import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import styled from 'styled-components';
import queries from '../queries/Matches';
import auth from '../utils/auth';
import MatchDetails from './MatchDetails';
import Loader from './Loader';
import MatchHistoryComponent from './MatchHistoryComponent';
import mutations from '../mutations/User';
import { Animate } from 'react-simple-animate';
import units from '../constants/units';
import matchUtils from '../utils/matches';

const Root = styled.div`
  flex: 1;
  overflow: auto;
`;

const HistoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoaderWrapper = styled.div`
  margin: ${units.margin} 0;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const setLoadingDetails = ({ id, matchDetails, isLoading, won, lost }) => ({
  ...matchDetails,
  players: matchDetails.players.map(player => {
    if (player.account_id === id) {
      return {
        ...player,
        loadingDetails: isLoading,
        won,
        lost,
      };
    }
    return {
      ...player,
      canLoad: !isLoading,
    };
  }),
});

const initMatchDetails = data => ({
  ...data,
  players: data.players.map(player => ({
    ...player,
    canLoad: true,
    loadingDetails: false,
  })),
});

const updatePlayerNote = ({ accountId, results }) => player => {
  if (player.account_id === accountId) {
    return {
      ...player,
      alreadyNoted: results.updatedNotedUsers.find(a => a.id === '' + player.account_id) ? true : false,
      note: results.updatedNote,
    };
  }
  return player;
};

class MatchHistory extends React.PureComponent {
  state = {
    offset: 0,
    limit: 10,
    matches: [],
    loading: true,
    loadingDetails: false,
    matchDetails: null,
    selectedMatchId: null,
    loadingMore: false,
  };

  componentDidMount = async () => {
    const { offset, limit } = this.state;

    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), limit, offset }));
    if (matches.length > 0) {
      const lastMatchId = matches[0].match_id;
      const {
        data: { getMatchDetails: data },
      } = await API.graphql(
        graphqlOperation(queries.getMatchDetails, { matchId: lastMatchId, currentUserId: auth.getUserId() }),
      );
      this.setState({ loading: false, matchDetails: initMatchDetails(data), matches, selectedMatchId: lastMatchId });
    } else {
      this.setState({ loading: false, matches: [] });
    }
  };

  loadData = async ({ isNext = false, isRefresh = false, isFirst }) => {
    this.setState({ loadingMore: true });
    const { offset, limit } = this.state;
    const newOffset = isFirst ? 0 : isRefresh ? offset : isNext ? offset + limit : offset - limit;
    const {
      data: { getMatches: matches },
    } = await API.graphql(
      graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), offset: newOffset, limit }),
    );

    if (matches.length > 0) {
      const lastMatchId = matches[0].match_id;
      const {
        data: { getMatchDetails: data },
      } = await API.graphql(
        graphqlOperation(queries.getMatchDetails, { matchId: lastMatchId, currentUserId: auth.getUserId() }),
      );

      this.setState({
        offset: newOffset,
        matches,
        loadingMore: false,
        matchDetails: initMatchDetails(data),
        selectedMatchId: lastMatchId,
      });
    } else {
      this.setState({ offset: newOffset, matches, loadingMore: false });
    }
  };

  loadPlayerDetails = async ({ id }) => {
    const { matchDetails } = this.state;
    this.setState({ matchDetails: setLoadingDetails({ id, matchDetails, isLoading: true }) });

    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: id, offset: 0, limit: 50 }));
    const wonCount = matchUtils.getMatchesWonCount(matches);
    this.setState({
      matchDetails: setLoadingDetails({
        id,
        matchDetails,
        isLoading: false,
        won: wonCount,
        lost: matches.length - wonCount,
      }),
    });
  };

  changeNumberDisplayed = async event => {
    const limit = event.target.value;
    await this.setState({ limit, loadingMore: true });
    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), offset: 0, limit }));

    if (matches.length > 0) {
      const lastMatchId = matches[0].match_id;
      const {
        data: { getMatchDetails: data },
      } = await API.graphql(
        graphqlOperation(queries.getMatchDetails, { matchId: lastMatchId, currentUserId: auth.getUserId() }),
      );
      this.setState({ matches, loadingMore: false, matchDetails: initMatchDetails(data), offset: 0, limit });
    } else {
      this.setState({ matches, loadingMore: false, offset: 0, limit });
    }
  };

  getMatchDetails = async ({ id }) => {
    await this.setState({ loadingDetails: true, selectedMatchId: id });
    const {
      data: { getMatchDetails: data },
    } = await API.graphql(graphqlOperation(queries.getMatchDetails, { matchId: id, currentUserId: auth.getUserId() }));
    this.setState({ loadingDetails: false, matchDetails: initMatchDetails(data) });
  };

  updateNote = async ({ isNotePlus, accountId }) => {
    const { matchDetails } = this.state;
    const { players } = matchDetails;
    const {
      data: { updateNote: results },
    } = await API.graphql(
      graphqlOperation(mutations.updateNote, { isNotePlus, accountId, currentUserId: auth.getUserId() }),
    );
    this.setState({
      matchDetails: {
        ...matchDetails,
        players: players.map(updatePlayerNote({ accountId, results })),
      },
    });
  };

  render() {
    const { matches, loading, offset, limit, matchDetails, loadingDetails, selectedMatchId, loadingMore } = this.state;
    return (
      <Root>
        {loading && (
          <LoaderWrapper>
            <Animate
              play
              startStyle={{ opacity: 0 }}
              endStyle={{ opacity: 1 }}
              render={() => <Loader message={'Loading matches'} />}
            />
          </LoaderWrapper>
        )}
        {!loading && (
          <Animate
            play
            startStyle={{ opacity: 0 }}
            endStyle={{ opacity: 1 }}
            render={() => (
              <>
                <MatchDetails
                  data={matchDetails}
                  loadingDetails={loadingDetails}
                  updateNote={this.updateNote}
                  loadPlayerDetails={this.loadPlayerDetails}
                />
                <HistoryWrapper>
                  {loadingMore && (
                    <LoaderWrapper>
                      <Animate
                        play
                        startStyle={{ opacity: 0 }}
                        endStyle={{ opacity: 1 }}
                        render={() => <Loader message={'Loading more matches'} />}
                      />
                    </LoaderWrapper>
                  )}
                  {!loadingMore && (
                    <MatchHistoryComponent
                      matches={matches}
                      getMatchDetails={this.getMatchDetails}
                      selectedMatchId={selectedMatchId}
                      loadData={this.loadData}
                      changeNumberDisplayed={this.changeNumberDisplayed}
                      offset={offset}
                      limit={limit}
                    />
                  )}
                </HistoryWrapper>
              </>
            )}
          />
        )}
      </Root>
    );
  }
}

export default MatchHistory;
