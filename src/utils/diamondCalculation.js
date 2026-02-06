const { DIAMOND_REWARDS } = require('../configs/gameConfig');

module.exports.diamondCal = (top3) => {
    return top3.map((entry, index) => [
        DIAMOND_REWARDS[index + 1] || 0,  // index 0 = rank 1, index 1 = rank 2, etc.
        entry.user_id
    ]);
}