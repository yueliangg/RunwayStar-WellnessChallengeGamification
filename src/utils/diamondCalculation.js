const { DIAMOND_REWARDS } = require('../configs/gameConfig');

module.exports.diamondCal = (top3) => {

    return top3.map(entry => [
            DIAMOND_REWARDS[entry.rank] || 0,  // diamonds based on rank
            entry.user_id ]);
}
