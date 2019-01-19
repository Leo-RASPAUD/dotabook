import User from '../types/User';
import UpdateNoteResult from '../types/UpdateNoteResult';

const createUser = `mutation createUser($avatar: String!, $note: Int!, $username: String!, $id: String!) {
    createUser(avatar: $avatar, note: $note, username: $username, id: $id) {
        ${User}
    }
  }`;

const updateNote = `mutation updateNote($accountId: String!, $currentUserId: String!, $isNotePlus: Boolean!) {
    updateNote(accountId: $accountId, currentUserId: $currentUserId, isNotePlus: $isNotePlus ) {
        ${UpdateNoteResult}
    }
}`;

export default {
  createUser,
  updateNote,
};
