import User from '../types/User';

const getUser = `query getUser($id: String!) {
    getUser(id: $id) {
        ${User}
    }
}`;

export default {
  getUser,
};
