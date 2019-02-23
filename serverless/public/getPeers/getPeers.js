const axios = require('axios');

const getPeers = async ({ userId }) => {
  const URL = `https://api.opendota.com/api/players/${userId}/peers`;
  return axios.get(URL);
};

module.exports.handler = async event => {
  const { userId } = event;
  try {
    const result = await getPeers({ userId });
    const peers = result.data;
    return peers;
  } catch (error) {
    console.log(error);
    return {
      peers: [],
    };
  }
};
