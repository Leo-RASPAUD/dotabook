import constants from '../constants/constants';

const removeUser = () => window.localStorage.removeItem(constants.LOCAL_STORAGE_KEY);
const isAuthenticated = () => window.localStorage.getItem(constants.LOCAL_STORAGE_KEY);
const getUserId = () => JSON.parse(window.localStorage.getItem(constants.LOCAL_STORAGE_KEY)).id;
const getUsername = () => JSON.parse(window.localStorage.getItem(constants.LOCAL_STORAGE_KEY)).username;
const getUser = () => JSON.parse(window.localStorage.getItem(constants.LOCAL_STORAGE_KEY));
const setUser = user => window.localStorage.setItem(constants.LOCAL_STORAGE_KEY, JSON.stringify(user));
const isFromRedirect = () => window.location.href.indexOf('openid') > -1;

const getProfileId = () => {
  const parsed = window.location.href.split('&');
  let profileId;
  parsed.forEach(a => {
    const split = a.split('openid.identity=');
    if (split.length > 1) {
      const identity = split[1];
      profileId = identity.split('%2Fid%2F')[1];
    }
  });
  return profileId;
};

export default {
  setUser,
  isFromRedirect,
  isAuthenticated,
  getUserId,
  removeUser,
  getUsername,
  getUser,
  getProfileId,
};
