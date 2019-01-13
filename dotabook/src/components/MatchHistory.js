import React from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import styled from 'styled-components';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import queries from '../queries/Matches';
import auth from '../utils/auth';
import time from '../utils/time';

const Data = styled.td`
  min-width: 150px;
  text-align: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  & tr td,
  th {
    box-shadow: 2px 0 0 0 #888, 0 2px 0 0 #888, 2px 2px 0 0 #888, 2px 0 0 0 #888 inset, 0 2px 0 0 #888 inset;
    padding: 10px;
  }
`;

const MatchHistoryComponent = ({ matches }) => (
  <Table>
    <thead>
      <tr>
        <th>Hero</th>
        <th>Date</th>
        <th>Result</th>
        <th>Duration</th>
        <th>K / D / A</th>
      </tr>
    </thead>
    <tbody>
      {matches.map(match => {
        const date = fromUnixTime(match.start_time);
        const isRadiant = match.player_slot < 5;
        const isWon = isRadiant && match.radiant_win;
        return (
          <tr key={match.match_id}>
            <td>
              <img src={`https://api.opendota.com${match.hero.img}`} alt="hero" height={50} width={100} />
            </td>
            <Data>{format(date, 'dd/MM/yyyy k:m')}</Data>
            <Data>{isWon ? 'Won match' : 'Lost match'}</Data>
            <Data>{time.secondsToHms(match.duration)}</Data>
            <Data>
              {match.kills} / {match.deaths} / {match.assists}
            </Data>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

class MatchHistory extends React.PureComponent {
  state = {
    offset: 0,
    limit: 10,
    matches: [],
    loading: true,
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
    await this.setState({ limit, loading: true });
    const {
      data: { getMatches: matches },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: auth.getUserId(), offset: 0, limit }));
    this.setState({ matches, loading: false, offset: 0, limit });
  };

  render() {
    const { matches, loading, offset, limit } = this.state;
    if (loading) {
      return <div>Loading matches...</div>;
    }
    return (
      <div>
        <select onChange={this.changeNumberDisplayed} value={limit}>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <MatchHistoryComponent matches={matches} />
        <button onClick={() => this.loadData({ isNext: false })} disabled={offset === 0}>
          Previous page
        </button>
        <button onClick={() => this.loadData({ isNext: true })}>Next page</button>
      </div>
    );
  }
}

export default MatchHistory;
