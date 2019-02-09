import React from 'react';
import Loader from './Loader';
import useFetcher from '../utils/useFetcher';
const Fetcher = ({ action, children }) => {
  const [data, loading, error] = useFetcher(action);
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;
  if (!data) return null;
  return children(data);
};
export default Fetcher;
