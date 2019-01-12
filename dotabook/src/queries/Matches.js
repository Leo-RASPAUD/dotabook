const getMatches = `query getMatches($profileId: String!) {
    getMatches(profileId: $profileId) {
        match_id,
        match_seq_num
        start_time
        lobby_type
        radiant_team_id
        dire_team_id
        players {
          account_id
          player_slot
          hero_id
          hero
          heroImages {
            small
            large
            full
          }
          playerDetails {
            avatarfull
            avatar
            loccountrycode
            personaname
          }
        }
    }
}`;

export default {
  getMatches,
};
