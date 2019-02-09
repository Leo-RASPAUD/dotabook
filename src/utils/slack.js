import axios from 'axios';

const SLACK_HOOK = 'https://hooks.slack.com/services/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';

const defaultFields = message => [{ title: 'Information', value: message }];

const post = async ({ message, fields }) => {
  const channel = '#events';
  const body = {
    channel,
    attachments: [
      {
        color: '4CAF50',
        pretext: `*${message}*`,
        fields: fields || defaultFields(message),
      },
    ],
  };
  return axios.post(SLACK_HOOK, JSON.stringify(body));
};

const loginUser = user => {
  const fields = [
    {
      title: 'Username',
      value: user.username,
    },
    {
      title: 'ID',
      value: user.id,
    },
  ];
  post({ message: 'New user logged in', fields });
};

export default {
  post,
  loginUser,
};
