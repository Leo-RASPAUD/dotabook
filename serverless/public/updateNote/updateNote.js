const AWS = require('aws-sdk');
const dbUtils = require('../utils/db.utils');
const constants = require('../constants/constants');

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const updateNotedUsers = ({ accountId, isNotePlus }) => user => {
  if (user.id === accountId) {
    return {
      ...user,
      updatedOn: Date.now(),
      note: isNotePlus ? 1 : -1,
    };
  }
  return user;
};

module.exports.handler = async ({ accountId, currentUserId, isNotePlus }) => {
  const dbCurrentUser = await dbUtils.getUser(currentUserId);
  const dbUserToUpdate = await dbUtils.getUser(accountId);

  const alreadyUpdated = dbCurrentUser.notedUsers && dbCurrentUser.notedUsers.find(item => item.id === '' + accountId);

  let updatedNotedUsers = [];
  const newNotedUser = { updatedOn: Date.now(), note: isNotePlus ? 1 : -1, id: accountId };
  const needsToBeUpdated =
    alreadyUpdated && ((alreadyUpdated.note === 1 && !isNotePlus) || (alreadyUpdated.note === -1 && isNotePlus));

  if (!dbCurrentUser.notedUsers) {
    updatedNotedUsers = [newNotedUser];
  } else if (needsToBeUpdated) {
    updatedNotedUsers = dbCurrentUser.notedUsers.map(updateNotedUsers({ accountId, isNotePlus }));
  } else if (!alreadyUpdated) {
    updatedNotedUsers = dbCurrentUser.notedUsers.concat(newNotedUser);
  } else {
    updatedNotedUsers = dbCurrentUser.notedUsers;
  }

  const updatedDbUser = {
    ...dbCurrentUser,
    notedUsers: updatedNotedUsers,
  };

  let newNote = dbUserToUpdate.note;
  if (needsToBeUpdated) {
    newNote = isNotePlus ? dbUserToUpdate.note + 2 : dbUserToUpdate.note - 2;
  } else if (!alreadyUpdated) {
    newNote = isNotePlus ? dbUserToUpdate.note + 1 : dbUserToUpdate.note - 1;
  }

  const updateNotedUser = {
    ...dbUserToUpdate,
    note: newNote,
  };

  await dynamoClient
    .batchWrite({
      RequestItems: {
        [constants.DOTABOOK_USER_TABLE]: [
          {
            PutRequest: {
              Item: updatedDbUser,
            },
          },
          {
            PutRequest: {
              Item: updateNotedUser,
            },
          },
        ],
      },
    })
    .promise();
  return {
    updatedNotedUsers,
    updatedNote: updateNotedUser.note,
  };
};
