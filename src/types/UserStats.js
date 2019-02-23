import User from './User';
import Match from './Match';
import Peer from './Peer';
import BestHero from './BestHero';

const UserStats = `
    matchesWon,
    matchesLost,
    currentWinStreak,
    user {
        ${User}
    } 
    matches {
        ${Match}
    }
    peers {
        ${Peer}
    }
    bestHero {
        ${BestHero}
    }
`;

export default UserStats;
