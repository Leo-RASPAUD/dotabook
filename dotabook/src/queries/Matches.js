const getMatches = `query getMatches($profileId: String!, $offset: String, $limit: String) {
    getMatches(profileId: $profileId, offset: $offset, limit: $limit) {
      match_id
      player_slot
      radiant_win
      duration
      game_mode
      lobby_type
      hero_id
      start_time
      version
      kills
      deaths
      assists
      skill
      leaver_status
      party_size,
      hero {
        id,
          name,
          localized_name,
          img,
          icon,
      }
    }
}`;

export default {
  getMatches,
};
