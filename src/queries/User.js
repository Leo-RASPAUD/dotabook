import User from '../types/User';

const getOpenIdUrl = `query getOpenIdUrl {
    getOpenIdUrl
}`;

const getUser = `query getUser($id: String!) {
    getUser(id: $id) {
        ${User}
    }
}`;

const getUserProfile = `query getUserProfile($profileId: String!) {
    getUserProfile(profileId: $profileId) {
        ${User}
    }
}`;

const searchUser = `query searchUser($username: String!) {
    searchUser(username: $username) {
        ${User}
    }
}`;

export default {
  getUser,
  getUserProfile,
  getOpenIdUrl,
  searchUser,
};
