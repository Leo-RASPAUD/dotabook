const axios = require('axios');

const API_KEY = '3DA79055CD92BB9EC7D2D48C64EF278A';
const apiKey = `?key=${API_KEY}`;

const json = `&format=json`;
const { corsHeaders } = require('../utils/http.utils');

const convertSteamId64 = id => `765${id + 61197960265728}`;
const convertSteamId32 = id => (id ? id.slice(3) - 61197960265728 : '');

const getHeroes = async () => {
  const BASE_URL = 'https://api.steampowered.com/IEconDOTA2_570/GetHeroes/v1/';
  return axios.get(`${BASE_URL}${apiKey}${json}`);
};

const getMatchHistory = async ({ profileId }) => {
  const accountId = `&account_id=${profileId}`;
  const BASE_URL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1/';
  return axios.get(`${BASE_URL}${apiKey}${json}${accountId}`);
};

const getAccountDetails = async ids => {
  const BASE_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
  return axios.get(`${BASE_URL}${apiKey}${json}&steamids=${ids.join(',')}`);
};

const formatPlayers = ({ heroes, playersDetails }) => player => {
  const hero = heroes.find(hero => hero.id === player.hero_id).name.split('npc_dota_hero_')[1];
  const baseHeroImage = `http://cdn.dota2.com/apps/dota2/images/heroes/`;
  return {
    ...player,
    playerDetails: playersDetails.find(details => details.account_id === player.account_id),
    hero,
    heroImages: {
      small: `${baseHeroImage}${hero}_sb.png`,
      large: `${baseHeroImage}${hero}_lg.png`,
      full: `${baseHeroImage}${hero}_full.png`,
    },
  };
};

const formatMatches = async ({ matches, heroes }) =>
  Promise.all(
    matches.map(async match => {
      const { players } = match;
      const ids = players.map(player => convertSteamId64(player.account_id));
      const playersDetailsResults = await getAccountDetails(ids);
      const playersDetails = playersDetailsResults.data.response.players;
      const formattedPlayersDetails = playersDetails.map(player => ({
        ...player,
        account_id: convertSteamId32(player.steamid),
      }));
      const formattedPlayers = players.map(formatPlayers({ heroes, playersDetails: formattedPlayersDetails }));
      return {
        ...match,
        players: formattedPlayers,
      };
    }),
  );

module.exports.handler = async event => {
  const { profileId } = event;
  try {
    const [heroesResult, matchesResult] = await Promise.all([getHeroes(), getMatchHistory({ profileId })]);
    const heroes = heroesResult.data.result.heroes;
    const matches = matchesResult.data.result.matches;

    const matchesFormatted = await formatMatches({ matches, heroes });
    return matchesFormatted;
  } catch (error) {
    console.log(error);
    return [];
  }
};
