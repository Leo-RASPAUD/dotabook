const AWS = require('aws-sdk');
const dbUtils = require('../utils/db.utils');
const constants = require('../constants/constants');

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const updateNotedUsers = ({ accountId, isNotePlus }) => user => {
  if (user.id === accountId) {
    return {
      ...user,
      updatedOn: Date.now(),
      note: isNotePlus ? user.note + 1 : user.note - 1,
    };
  }
  return user;
};

module.exports.handler = async ({ accountId, currentUserId, isNotePlus }) => {
  const dbCurrentUser = await dbUtils.getUser(currentUserId);
  const dbUserToUpdate = await dbUtils.getUser(accountId);

  console.log(dbCurrentUser);
  console.log(dbUserToUpdate);
  const alreadyUpdated = dbCurrentUser.notedUsers && dbCurrentUser.notedUsers.find(item => item.id === accountId);

  let updatedNotedUsers = [];
  const newNotedUser = { updatedOn: Date.now(), note: isNotePlus ? 1 : 0, id: accountId };
  if (!dbCurrentUser.notedUsers) {
    updatedNotedUsers = [newNotedUser];
  } else if (alreadyUpdated) {
    updatedNotedUsers = dbCurrentUser.notedUsers.map(updateNotedUsers({ accountId, isNotePlus }));
  } else {
    updatedNotedUsers = dbCurrentUser.notedUsers.concat(newNotedUser);
  }

  const updatedDbUser = {
    ...dbCurrentUser,
    notedUsers: updatedNotedUsers,
  };

  const updateNotedUser = {
    ...dbUserToUpdate,
    note: isNotePlus ? dbUserToUpdate.note + 1 : dbUserToUpdate.note - 1,
  };

  const results = await dynamoClient
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
  console.log(results);
  return {
    updatedNotedUsers,
    updatedNote: updateNotedUser.note,
  };
};
