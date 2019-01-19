const convertSteamId32 = id => (id ? id.slice(3) - 61197960265728 : '');
const convertSteamId64 = id => '765' + (+id + 61197960265728);

module.exports = {
  convertSteamId32,
  convertSteamId64,
};
