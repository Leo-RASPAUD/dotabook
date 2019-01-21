const openid = require('openid');

module.exports.getUrl = async ({ location }) => {
  const relyingParty = new openid.RelyingParty(location, null, true, false, []);
  return await new Promise(resolve => {
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authURL) => {
      resolve(authURL);
    });
  });
};
