const isMatchWon = (radiant_win, isRadiant) => (isRadiant && radiant_win) || (!isRadiant && !radiant_win);

const getMatchesWonCount = matches => matches.reduce((a, b) => a + isMatchWon(b.radiant_win, b.player_slot < 128), 0);

const findCurrentWinStreak = matches => {
  let streak = 0;
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (isMatchWon(match.radiant_win, match.player_slot < 128)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export default {
  getMatchesWonCount,
  isMatchWon,
  findCurrentWinStreak,
};
