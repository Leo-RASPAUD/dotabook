const axios = require('axios');
const dbUtils = require('../utils/db.utils');

const searchPlayersOpendota = async username => {
  const BASE_URL = 'https://api.opendota.com/api/search?q=';
  return axios.get(`${BASE_URL}${username}`);
};

module.exports.handler = async ({ username }) => {
  try {
    const [resultsDb, resultsOD] = await Promise.all([dbUtils.searchUser(username), searchPlayersOpendota(username)]);
    if (resultsDb.length > 0) {
      return resultsDb.slice(0, 5);
    } else {
      const players = resultsOD.data.slice(0, 5).map(player => ({
        id: '' + player.account_id,
        note: 0,
        alreadyNoted: false,
        createdOn: Date.now(),
        updatedOn: Date.now(),
        username: player.personaname,
        avatar: player.avatarfull,
        usernameLowercase: player.personaname.toLowerCase(),
        notedUsers: [],
      }));
      await dbUtils.createUsers(players);
      return players;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
