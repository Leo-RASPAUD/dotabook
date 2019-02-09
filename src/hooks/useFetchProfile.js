import { useState, useLayoutEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import mutations from '../mutations/User';
import authUtils from '../utils/auth';
import queries from '../queries/User';

const { isFromRedirect, getProfileId, setUser } = authUtils;

const useFetchProfile = () => {
  const [isLoading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!isFromRedirect()) {
      setLoading(false);
    } else {
      const {
        data: { getUserProfile: user },
      } = await API.graphql(graphqlOperation(queries.getUserProfile, { profileId: getProfileId() }));

      const {
        data: { createUser: createdUser },
      } = await API.graphql(
        graphqlOperation(mutations.createUser, {
          username: user.username,
          avatar: user.avatar,
          id: user.id,
        }),
      );

      setUser(createdUser);
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    fetchProfile();
  }, []);

  return isLoading;
};

export default useFetchProfile;
