const AWS = require('aws-sdk');
const constants = require('../constants/constants');
const dbUtils = require('./db.utils');

const testGetUser = async () => {
  try {
    const test = await dbUtils.getUser('76561197993242090');
    console.log(test);
  } catch (error) {
    console.log(error);
  }
};

const testFindUser = async () => {
  try {
    const test = await dbUtils.searchUser('GrimstrokeOnly');
    console.log('test', test);
  } catch (error) {
    console.log(error);
  }
};

const writeItems = async ({ chunk, chunks, client, table }) => {
  const { UnprocessedItems } = await client
    .batchWrite({
      RequestItems: {
        [table]: chunk.map(item => ({ PutRequest: { Item: item } })),
      },
    })
    .promise();
  if (UnprocessedItems.length) {
    chunks.push(UnprocessedItems);
  }
};

/* eslint-disable no-await-in-loop */
const batchedAsync = async ({ client, list, chunkSize = 10, msDelayBetweenChunks = 0, table }) => {
  console.log(`${list.length} items to create or update`);
  const emptyList = new Array(Math.ceil(list.length / chunkSize)).fill();
  const clonedList = list.slice(0);
  const chunks = emptyList.map(() => clonedList.splice(0, chunkSize));
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    if (msDelayBetweenChunks) {
      await new Promise(resolve => setTimeout(resolve, msDelayBetweenChunks));
    }
    await writeItems({ client, chunk, chunks, table });
  }
};

updateUserAvatars = async () => {
  const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'ap-southeast-2' });
  try {
    var params = {
      TableName: constants.DOTABOOK_USER_TABLE,
    };

    const results = await dynamoClient.scan(params).promise();

    const tmp = results.Items.map(item => {
      if (item.avatar.indexOf('full') === -1) {
        item.avatar = `${item.avatar.split('.jpg')[0]}_full.jpg`;
      }
      return item;
    });

    console.log(tmp);

    batchedAsync({
      list: tmp,
      client: dynamoClient,
      chunkSize: 25,
      msDelayBetweenChunks: 1000,
      table: constants.DOTABOOK_USER_TABLE,
    });
  } catch (error) {
    console.log(error);
  }
};
