const pool = require("../services/db");

// Insert Challenge
module.exports.insertChallenge = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO WellnessChallenge (description, creator_id, points)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.description, data.creator_id, data.points];

    pool.query(SQLSTATMENT, VALUES, callback);
};

// Select challenge by id
module.exports.selectChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT 
    id, description, creator_id, points
    FROM WellnessChallenge
    WHERE id = ?`;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select all challenge
module.exports.selectAllChallenge = (callback) => {
    const SQLSTATEMENT = `SELECT * FROM WellnessChallenge`;

    pool.query(SQLSTATEMENT, callback);
};

//update challenge
module.exports.updateChallenge = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE WellnessChallenge
    SET description = ?, creator_id = ?, points =?
    WHERE id = ?`;

    const VALUES = [data.description, data.creator_id, data.points, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//delete challenfe by id
module.exports.deleteChallenge = (data, callback) => {
    const SQLSTATEMENT = `DELETE FROM WellnessChallenge WHERE id = ?`;
    const VALUES = [data.challenge_id]; 
    pool.query(SQLSTATEMENT, VALUES, callback);
};

//delete user completetion
module.exports.deleteUserCompletion = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//delete user completetion
module.exports.deleteUserCompletionById = (data, callback) =>
{
    const SQLSTATEMENT = `
        DELETE FROM UserCompletion 
        WHERE challenge_id = ? AND user_id = ?;
    `;
    const VALUES = [data.challenge_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//insert record
module.exports.insertRecord = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO UserCompletion (challenge_id, user_id, details)
    VALUES (?, ?, ?);
    `;
    const VALUES = [data.challenge_id, data.user_id, data.details];

    pool.query(SQLSTATMENT, VALUES, callback);
};

//add user points
module.exports.addUserPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET points = points + ?
        WHERE id = ?
    `;
    const VALUES = [data.points, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select record
module.exports.selectRecord = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM UserCompletion
    WHERE id = ?`;

    const VALUES = [data.completion_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select record by User
module.exports.selectUserCompletionByUser = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM UserCompletion
    WHERE challenge_id = ? AND user_id = ?`;

    const VALUES = [data.challenge_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select all completions
module.exports.selectAllCompletions = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, details
        FROM UserCompletion
        WHERE challenge_id = ?
    `;
    const VALUES = [data.challenge_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select all completions by user
module.exports.selectAllCompletionsByUser = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            uc.id AS completion_id,
            uc.user_id,
            uc.challenge_id,
            uc.details,
            wc.creator_id,
            wc.description,
            wc.points
        FROM UserCompletion uc
        JOIN WellnessChallenge wc
            ON uc.challenge_id = wc.id
        WHERE uc.user_id = ?
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

