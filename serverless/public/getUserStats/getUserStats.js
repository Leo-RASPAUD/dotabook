const axios = require('axios');
const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'ap-southeast-2' });

const getMatchHistory = async ({ profileId, offset = 0, limit = 10 }) => {
  const BASE_URL = 'https://api.opendota.com/api/players/';
  return axios.get(`${BASE_URL}${profileId}/matches?offset=${offset}&limit=${limit}`);
};

const searchUser = async ({ username, avatar, id }) => {
  var params = {
    FunctionName: 'arn:aws:lambda:ap-southeast-2:519264136416:function:Dotabook-public-PROD-createUser',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ username, avatar, id }),
  };
  const { Payload } = await lambda.invoke(params).promise();
  return Payload;
};

module.exports.handler = async event => {
  const { id, username, avatar } = event;
  try {
    const [user, matches] = await Promise.all([
      searchUser({ id, username, avatar }),
      getMatchHistory({ profileId: id, limit: -1 }),
    ]);

    return {
      user: JSON.parse(user),
      matches: matches.data,
    };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      matches: [],
    };
  }
};
