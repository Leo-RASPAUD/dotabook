const dbUtils = require('../utils/db.utils');

module.exports.handler = async ({ username, avatar, id }) => {
  try {
    let player;
    const resultsDb = await dbUtils.searchUser(username);
    if (resultsDb.length > 0) {
      player = {
        ...resultsDb[0],
        username,
        avatar,
      };
    } else {
      player = {
        id,
        note: 0,
        alreadyNoted: false,
        createdOn: Date.now(),
        updatedOn: Date.now(),
        username,
        avatar,
        usernameLowercase: username.toLowerCase(),
        notedUsers: [],
      };
    }
    await dbUtils.createUsers([player]);
    return player;
  } catch (error) {
    console.log(error);
    return [];
  }
};
