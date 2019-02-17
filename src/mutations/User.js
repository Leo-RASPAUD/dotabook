import User from '../types/User';
import UpdateNoteResult from '../types/UpdateNoteResult';

const createUser = `mutation createUser($avatar: String!, $username: String!, $id: String!) {
    createUser(avatar: $avatar, username: $username, id: $id) {
        ${User}
    }
  }`;

const updateNote = `mutation updateNote($accountId: String!, $currentUserId: String!, $isNotePlus: Boolean!, $username: String!) {
    updateNote(accountId: $accountId, currentUserId: $currentUserId, isNotePlus: $isNotePlus, username: $username ) {
        ${UpdateNoteResult}
    }
}`;

export default {
  createUser,
  updateNote,
};
