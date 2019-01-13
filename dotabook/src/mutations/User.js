import User from '../types/User';

const createUser = `mutation createUser($avatar: String!, $note: Int!, $username: String!, $id: String!) {
    createUser(avatar: $avatar, note: $note, username: $username, id: $id) {
        ${User}
    }
  }`;

const updateNote = `mutation updateNote($id: String!, $note: Int!) {
    updateNote(id: $id, note: $note) {
        ${User}
    }
}`;

export default {
  createUser,
  updateNote,
};
