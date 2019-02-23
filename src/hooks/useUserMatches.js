import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import queries from '../queries/Matches';

export default ({ userId }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const loadMatches = async () => {
    setLoading(true);
    const {
      data: { getMatches: results },
    } = await API.graphql(graphqlOperation(queries.getMatches, { profileId: userId, limit: -1, offset: 0 }));
    setLoading(false);
    setMatches(results);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return [isLoading, matches];
};
