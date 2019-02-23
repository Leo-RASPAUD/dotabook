const axios = require('axios');
const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'ap-southeast-2' });

const isMatchWon = (radiant_win, isRadiant) => (isRadiant && radiant_win) || (!isRadiant && !radiant_win);

const getMatchesWonCount = matches => matches.reduce((a, b) => a + isMatchWon(b.radiant_win, b.player_slot < 128), 0);

const findCurrentWinStreak = matches => {
  let streak = 0;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (isMatchWon(match.radiant_win, match.player_slot < 128)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const getHeroes = ({ userId }) => {
  return axios.get(`https://api.opendota.com/api/players/${userId}/heroes`);
};

const getHeroesStats = async () => {
  return axios.get(`https://api.opendota.com/api/heroStats`);
};

const searchUser = async ({ username, avatar, id }) => {
  const params = {
    FunctionName: 'arn:aws:lambda:ap-southeast-2:519264136416:function:Dotabook-public-PROD-createUser',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ username, avatar, id }),
  };
  const { Payload } = await lambda.invoke(params).promise();
  return Payload;
};

const getPeers = async ({ userId }) => {
  const params = {
    FunctionName: 'arn:aws:lambda:ap-southeast-2:519264136416:function:Dotabook-public-PROD-getPeers',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ userId }),
  };
  const { Payload } = await lambda.invoke(params).promise();
  return Payload;
};

const getMatchHistory = async ({ profileId }) => {
  const params = {
    FunctionName: 'arn:aws:lambda:ap-southeast-2:519264136416:function:Dotabook-public-PROD-getMatchHistory',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ profileId, offset: 0, limit: -1 }),
  };
  const { Payload } = await lambda.invoke(params).promise();
  return Payload;
};

module.exports.handler = async event => {
  const { id, username, avatar } = event;
  try {
    const [peersResult, userResult, matchesResult, heroesResult, heroesStatsResult] = await Promise.all([
      getPeers({ userId: id }),
      searchUser({ id, username, avatar }),
      getMatchHistory({ profileId: id }),
      getHeroes({ userId: id }),
      getHeroesStats(),
    ]);

    const matches = JSON.parse(matchesResult);
    const user = JSON.parse(userResult);
    const peers = JSON.parse(peersResult);
    const heroes = heroesResult.data;
    const heroesStats = heroesStatsResult.data;
    const matchesWon = getMatchesWonCount(matches);
    const bestHero = heroes.reduce(
      (a, b) => {
        if (b.games < 20) return a;
        const winrate = b.win / b.games;
        if (winrate > a.winrate) return { games: b.games, winrate, ...heroesStats.find(h => h.id === +b.hero_id) };
        return a;
      },
      { winrate: 0 },
    );

    return {
      user,
      matches,
      peers,
      bestHero,
      currentWinStreak: findCurrentWinStreak(matches),
      matchesWon,
      matchesLost: matches.length - matchesWon,
    };
  } catch (error) {
    console.log(error);
    return {
      user: null,
      matches: [],
    };
  }
};
