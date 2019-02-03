const isMatchWon = (radiant_win, isRadiant) => (isRadiant && radiant_win) || (!isRadiant && !radiant_win);

const getMatchesWonCount = matches => matches.reduce((a, b) => a + isMatchWon(b.radiant_win, b.player_slot < 128), 0);

export default {
  getMatchesWonCount,
  isMatchWon,
};
