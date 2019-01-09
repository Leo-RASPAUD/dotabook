const openid = require('openid');
const { corsHeaders } = require('../utils/http.utils');

const relyingParty = new openid.RelyingParty('http://localhost:3000/login', null, true, false, []);

module.exports.getUrl = async () => {
  return await new Promise(resolve => {
    relyingParty.authenticate('https://steamcommunity.com/openid', false, (err, authURL) => {
      resolve({
        statusCode: 200,
        headers: corsHeaders,
        body: authURL,
      });
    });
  });
};
