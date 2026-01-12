const pool = require("../services/db");

module.exports.selectRunwayStarsByShow = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM RunwayStar
        WHERE show_id = ?
    `;
    const VALUES = [data.show_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert top 3 into RunwayStar
module.exports.insertTop3RunwayStars = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO RunwayStar
        (user_id, show_id, total_attraction, final_rank, diamonds_won)
        VALUES ?
    `;

    const VALUES = [data.values];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectRunwayStarsByShow = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM RunwayStar
        WHERE show_id = ?
        ORDER BY final_rank ASC
    `;
    const VALUES = [data.show_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectAllFinalRunwayStars = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM RunwayStar
        ORDER BY show_id ASC, final_rank ASC
    `;

    pool.query(SQLSTATEMENT, callback);
};

module.exports.deleteEntry = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM RunwayStar
        WHERE show_id = ? AND user_id = ?
    `;

    const VALUES = [data.fashion_show_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};