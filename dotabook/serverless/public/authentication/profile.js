const axios = require('axios');
const { corsHeaders } = require('../utils/http.utils');

const API_KEY = '3DA79055CD92BB9EC7D2D48C64EF278A';
const apiKey = `?key=${API_KEY}`;
const json = `&format=json`;

module.exports.handler = async event => {
  const {
    queryStringParameters: { profileId },
  } = event;

  const BASE_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
  try {
    const result = await axios.get(`${BASE_URL}${apiKey}${json}&steamids=[${profileId}]`);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.data.response.players[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify(null),
    };
  }
};
