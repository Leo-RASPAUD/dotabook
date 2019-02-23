const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'ap-southeast-2' });

const searchUser = async ({ username, avatar, id }) => {
  var params = {
    FunctionName: 'arn:aws:lambda:ap-southeast-2:519264136416:function:Dotabook-public-PROD-createUser',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ username, avatar, id }),
  };
  const result = await lambda.invoke(params).promise();
  console.log(result);
  return result;
};

searchUser({
  username: 'koin',
  id: '108938523',
  avatar:
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/0f/0fe4e80e423716b8f4ca1feae9ce49067de2ffed_full.jpg',
});
