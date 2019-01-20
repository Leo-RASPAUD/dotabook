const AWS = require('aws-sdk');
const constants = require('../constants/constants');

const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-2' });

const getUser = async id => {
  const params = {
    TableName: constants.DOTABOOK_USER_TABLE,
    Key: { id: '' + id },
  };
  const result = await dynamoClient.get(params).promise();
  return result.Item;
};

const searchUser = async username => {
  const params = {
    TableName: constants.DOTABOOK_USER_TABLE,
    IndexName: constants.DOTABOOK_USER_INDEXES.usernameLowercase,
    KeyConditionExpression: 'usernameLowercase = :usernameLowercase',
    ExpressionAttributeValues: {
      ':usernameLowercase': ('' + username).toLowerCase(),
    },
  };
  const result = await dynamoClient.query(params).promise();
  return result.Items;
};

const createUsers = async users => {
  return dynamoClient
    .batchWrite({
      RequestItems: {
        [constants.DOTABOOK_USER_TABLE]: users.map(item => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    })
    .promise();
};

module.exports = {
  getUser,
  searchUser,
  createUsers,
};
