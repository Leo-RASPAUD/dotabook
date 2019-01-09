import User from '../types/User';

const createUser = `mutation createUser($avatar: String!, $note: Int!, $username: String!, $id: String!) {
    createUser(avatar: $avatar, note: $note, username: $username, id: $id) {
        ${User}
    }
  }`;

export default {
  createUser,
};
