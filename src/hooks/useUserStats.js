import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { API, graphqlOperation } from 'aws-amplify';
import queries from '../queries/User';

export default ({ username, id, avatar }) => {
  const [userStats, setUserStats] = useState({});
  const [isLoading, setLoading] = useState(true);

  const loadUserStats = async () => {
    setLoading(true);
    const {
      data: { getUserStats: results },
    } = await API.graphql(graphqlOperation(queries.getUserStats, { username, id, avatar }));
    setUserStats(results);
    setLoading(false);
  };

  useEffect(() => {
    loadUserStats();
  }, []);

  return [isLoading, userStats];
};
