const pool = require("../services/db");

module.exports.insertChallenge = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO WellnessChallenge (description, creator_id, points)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.description, data.creator_id, data.points];

    pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.selectChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT 
    id, description, creator_id, points
    FROM WellnessChallenge
    WHERE id = ?`;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectAllChallenge = (callback) => {
    const SQLSTATEMENT = `SELECT * FROM WellnessChallenge`;

    pool.query(SQLSTATEMENT, callback);
};

module.exports.updateChallenge = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE WellnessChallenge
    SET description = ?, creator_id = ?, points =?
    WHERE id = ?`;

    const VALUES = [data.description, data.creator_id, data.points, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.deleteChallenge = (data, callback) => {
    const SQLSTATEMENT = `DELETE FROM WellnessChallenge WHERE id = ?`;
    const VALUES = [data.challenge_id]; 
    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.deleteUserCompletion = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertRecord = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO UserCompletion (challenge_id, user_id, details)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.user_id, data.details];

    pool.query(SQLSTATMENT, VALUES, callback);
};

module.exports.addUserPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET points = points + ?
        WHERE id = ?
    `;
    const VALUES = [data.points, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectRecord = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM UserCompletion
    WHERE id = ?`;

    const VALUES = [data.completion_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


module.exports.selectAllCompletions = (data, callback) => {
    const SQL = `
        SELECT user_id, details
        FROM UserCompletion
        WHERE challenge_id = ?
    `;
    const VALUES = [data.challenge_id]
    pool.query(SQL, VALUES, callback);
};
