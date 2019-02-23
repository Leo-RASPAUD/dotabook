import User from '../types/User';
import Peer from '../types/Peer';
import UserStats from '../types/UserStats';

const getOpenIdUrl = `query getOpenIdUrl($location: String!) {
    getOpenIdUrl(location: $location)
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

const getPeers = `query getPeers($userId: String!) {
    getPeers(userId: $userId) {
        ${Peer}
    }
}`;

const getUserStats = `query getUserStats($id: String!, $avatar: String!, $username: String!) {
    getUserStats(id: $id, avatar: $avatar, username: $username) {
        ${UserStats}
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
  getPeers,
  getUserStats,
};
