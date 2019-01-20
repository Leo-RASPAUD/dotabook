const openid = require('openid');

const relyingParty = new openid.RelyingParty('http://localhost:3000/login', null, true, false, []);

module.exports.getUrl = async () => {
  return await new Promise(resolve => {
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authURL) => {
      resolve(authURL);
    });
  });
};
