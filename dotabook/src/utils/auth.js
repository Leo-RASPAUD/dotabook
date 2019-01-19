import constants from '../constants/constants';

const removeUser = () => window.localStorage.removeItem(constants.LOCAL_STORAGE_KEY);
const isAuthenticated = () => window.localStorage.getItem(constants.LOCAL_STORAGE_KEY);
const getUserId = () => JSON.parse(window.localStorage.getItem(constants.LOCAL_STORAGE_KEY)).id;

export default {
  isAuthenticated,
  getUserId,
  removeUser,
};
