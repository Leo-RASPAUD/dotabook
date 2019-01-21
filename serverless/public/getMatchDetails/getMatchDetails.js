const axios = require('axios');
const AWS = require('aws-sdk');
const constants = require('../constants/constants');
const dbUtils = require('../utils/db.utils');
const utils = require('../utils/utils');

const API_KEY = '3DA79055CD92BB9EC7D2D48C64EF278A';
const apiKey = `?key=${API_KEY}`;
const json = `&format=json`;

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const getIdOnly = player => ({
  id: '' + player.account_id,
});

const getMatchHistory = async ({ matchId }) => {
  const BASE_URL = 'https://api.opendota.com/api/matches/';
  return axios.get(`${BASE_URL}${matchId}`);
};

const getHeroes = async () => {
  return axios.get(`https://api.opendota.com/api/heroStats`);
};

const updateExistingPlayersWithLatestUsernames = updatedPlayersDetails => player => {
  const updated = updatedPlayersDetails.find(a => '' + a.id === '' + player.id);
  if (updated) {
    return {
      ...player,
      username: updated.personaname,
    };
  }
  return player;
};

const getPlayersDetails = async players => {
  const BASE_URL = 'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/';
  const convertedIds = players.map(player => utils.convertSteamId64(player.account_id)).join(',');
  const results = await axios.get(`${BASE_URL}${apiKey}${json}&steamids=[${convertedIds}]`);
  const data = results.data.response.players;
  return data.map(player => ({ ...player, id: utils.convertSteamId32(player.steamid) }));
};

const updatePlayers = async ({ players, currentUser }) => {
  const existingPlayers = await dbUtils.searchByIds(players.map(getIdOnly));
  const updatedPlayersDetails = await getPlayersDetails(players);

  const udpatedExistingPlayers = existingPlayers.map(updateExistingPlayersWithLatestUsernames(updatedPlayersDetails));

  const toUpdate = updatedPlayersDetails.map(player => {
    const isFind = udpatedExistingPlayers.find(a => '' + a.id === '' + player.id);
    const alreadyNoted = currentUser.notedUsers.find(a => a.id === '' + player.id);
    if (isFind) {
      if (alreadyNoted) {
        return {
          ...isFind,
          alreadyNoted: true,
          note: alreadyNoted.note,
        };
      }
      return {
        ...isFind,
        alreadyNoted: false,
      };
    }
    return {
      id: '' + player.id,
      note: 0,
      alreadyNoted: false,
      createdOn: Date.now(),
      updatedOn: Date.now(),
      username: player.personaname,
      avatar: player.avatar,
      usernameLowercase: player.personaname.toLowerCase(),
      notedUsers: [],
    };
  });

  console.log(JSON.stringify(toUpdate));

  await dbUtils.createUsers(toUpdate);
  return toUpdate;
};

module.exports.handler = async event => {
  const { matchId, currentUserId } = event;
  try {
    const [matchResult, heroesResult, currentUser] = await Promise.all([
      getMatchHistory({ matchId }),
      getHeroes(),
      dbUtils.getUser(currentUserId),
    ]);
    const matchDetails = matchResult.data;
    const heroes = heroesResult.data;

    const updatedPlayers = await updatePlayers({
      players: matchDetails.players.filter(player => player.personaname),
      currentUser,
    });
    return {
      ...matchDetails,
      players: matchDetails.players.map(player => {
        const { id, name, localized_name, img, icon } = heroes.find(hero => hero.id === player.hero_id);
        const isUpdated = updatedPlayers.find(item => item.id === '' + player.account_id);
        return {
          ...player,
          ...(isUpdated ? isUpdated : {}),
          hero: { id, name, localized_name, img, icon },
        };
      }),
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
