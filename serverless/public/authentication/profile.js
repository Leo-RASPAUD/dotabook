const axios = require('axios');
const utils = require('../utils/utils');
const { convertSteamId32 } = utils;

const API_KEY = '3DA79055CD92BB9EC7D2D48C64EF278A';
const apiKey = `?key=${API_KEY}`;
const json = `&format=json`;

module.exports.handler = async ({ profileId }) => {
  const BASE_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
  try {
    const result = await axios.get(`${BASE_URL}${apiKey}${json}&steamids=[${profileId}]`);
    const user = result.data.response.players[0];
    return {
      ...user,
      username: user.personaname,
      id: convertSteamId32(user.steamid),
    };
  } catch (error) {
    return null;
  }
};
