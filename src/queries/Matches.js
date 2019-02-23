import Match from '../types/Match';

const getMatches = `query getMatches($profileId: String!, $offset: String, $limit: String) {
    getMatches(profileId: $profileId, offset: $offset, limit: $limit) {
      ${Match}
    }
}`;

const getMatchDetails = ` query getMatchDetails($matchId: String!, $currentUserId: String!) {
  getMatchDetails(matchId: $matchId, currentUserId:$currentUserId) {
    match_id
    dire_score
    duration
    first_blood_time
    game_mode
    radiant_score
    radiant_win
    start_time
    players {
      alreadyNoted
      note
      account_id
      assists
      deaths
      kills
      username
      isRadiant
      player_slot
      hero {
        id,
        name,
        localized_name,
        img,
        icon,
      }
    }
    patch
  }
}`;

export default {
  getMatches,
  getMatchDetails,
};
