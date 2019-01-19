const axios = require('axios');
const AWS = require('aws-sdk');
const utils = require('../utils/utils');
const { convertSteamId32, convertSteamId64 } = utils;
const constants = require('../constants/constants');

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const getMatchHistory = async ({ matchId }) => {
  const BASE_URL = 'https://api.opendota.com/api/matches/';
  return axios.get(`${BASE_URL}${matchId}`);
};

const getHeroes = async () => {
  return axios.get(`https://api.opendota.com/api/heroStats`);
};

const updatePlayers = async players => {
  const playersGetRequest = players.map(player => ({
    id: '' + player.account_id,
  }));

  const result = await dynamoClient
    .batchGet({
      RequestItems: {
        [constants.DOTABOOK_USER_TABLE]: {
          Keys: playersGetRequest,
        },
      },
    })
    .promise();
  const existingPlayers = result.Responses[constants.DOTABOOK_USER_TABLE];

  const toUpdate = players.map(player => {
    const isFind = existingPlayers.find(a => a.id === player.account_id);
    if (isFind) {
      return isFind;
    }
    return {
      id: '' + player.account_id,
      note: 0,
      createdOn: Date.now(),
      updatedOn: Date.now(),
      username: player.personaname,
    };
  });

  await dynamoClient
    .batchWrite({
      RequestItems: {
        [constants.DOTABOOK_USER_TABLE]: toUpdate.map(item => ({
          PutRequest: {
            Item: item,
          },
        })),
      },
    })
    .promise();

  return toUpdate;
};

module.exports.handler = async event => {
  const { matchId } = event;
  console.log(event);
  try {
    const [matchResult, heroesResult] = await Promise.all([getMatchHistory({ matchId }), getHeroes()]);
    const matchDetails = matchResult.data;
    const heroes = heroesResult.data;

    const updatedPlayers = await updatePlayers(matchDetails.players.filter(player => player.personaname));
    return {
      ...matchDetails,
      players: matchDetails.players.map(player => {
        const { id, name, localized_name, img, icon } = heroes.find(hero => hero.id === player.hero_id);
        const isUpdated = updatedPlayers.find(item => item.id === player.account_id);
        return {
          ...player,
          note: isUpdated ? isUpdated.note : 0,
          hero: { id, name, localized_name, img, icon },
        };
      }),
    };
  } catch (error) {
    console.log(error);
    return [];
  }
};
