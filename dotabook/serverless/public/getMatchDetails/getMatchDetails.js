const axios = require('axios');
const AWS = require('aws-sdk');

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const convertSteamId64 = id => '765' + (+id + 61197960265728);
const convertSteamId32 = id => (id ? +id.slice(3) - 61197960265728 : '');

const getMatchHistory = async ({ matchId }) => {
  const BASE_URL = 'https://api.opendota.com/api/matches/';
  return axios.get(`${BASE_URL}${matchId}`);
};

const getHeroes = async () => {
  return axios.get(`https://api.opendota.com/api/heroStats`);
};

const updatePlayers = async players => {
  const playersGetRequest = players
    .filter(player => player.personaname)
    .map(player => ({
      id: convertSteamId64(player.account_id),
    }));

  const result = await dynamoClient
    .batchGet({
      RequestItems: {
        DatabookUserTable: {
          Keys: playersGetRequest,
        },
      },
    })
    .promise();
  const existingPlayers = result.Responses.DatabookUserTable;

  const toUpdate = players.map(player => {
    const id = convertSteamId64(player.account_id);
    const isFind = existingPlayers.find(a => a.id === id);
    if (isFind) {
      return isFind;
    }
    return {
      id,
      note: 0,
      createdOn: Date.now(),
      updatedOn: Date.now(),
      username: player.personaname,
    };
  });

  await dynamoClient
    .batchWrite({
      RequestItems: {
        DatabookUserTable: toUpdate.map(item => ({
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
        const isUpdated = updatedPlayers.find(item => convertSteamId32(item.id) === player.account_id);
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
