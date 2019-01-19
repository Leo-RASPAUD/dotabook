import NotedUser from './NotedUser';

const UpdateNoteResult = `
    updatedNote
	updatedNotedUsers {
        ${NotedUser}
    } 
`;

export default UpdateNoteResult;
