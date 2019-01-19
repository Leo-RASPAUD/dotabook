const axios = require('axios');

const getMatchHistory = async ({ profileId, offset = 0, limit = 10 }) => {
  const BASE_URL = 'https://api.opendota.com/api/players/';
  return axios.get(`${BASE_URL}${profileId}/matches?offset=${offset}&limit=${limit}`);
};

const getHeroes = async () => {
  return axios.get(`https://api.opendota.com/api/heroStats`);
};

module.exports.handler = async event => {
  const { profileId, offset, limit } = event;
  try {
    const [matchesResult, heroesResult] = await Promise.all([
      getMatchHistory({ profileId, offset, limit }),
      getHeroes(),
    ]);
    const matches = matchesResult.data;
    const heroes = heroesResult.data;
    return matches.map(match => {
      const { id, name, localized_name, img, icon } = heroes.find(hero => hero.id === match.hero_id);
      return {
        ...match,
        hero: {
          id,
          name,
          localized_name,
          img,
          icon,
        },
      };
    });
  } catch (error) {
    console.log(error);
    return [];
  }
};
