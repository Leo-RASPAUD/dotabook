const Match = `
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
`;

export default Match;
