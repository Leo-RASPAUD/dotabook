const convertSteamId32 = id => (id ? id.slice(3) - 61197960265728 : '');
const convertSteamId64 = id => '765' + (+id + 61197960265728);

export default {
  convertSteamId32,
  convertSteamId64,
};
