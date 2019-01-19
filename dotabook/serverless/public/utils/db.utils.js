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

module.exports = {
  getUser,
};
