const pool = require("../services/db");

// Check Username or Email Exist
module.exports.checkUsernameOrEmailExist = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM User 
        WHERE username = ? OR email = ?
    `;

    const VALUES = [data.username, data.email];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select User by Username
module.exports.selectUserByUsername = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT * FROM User 
        WHERE username = ?
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.insertUser = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO User (username, star_name)
    VALUES (?, ?);
    `;
    const VALUES = [data.username, data.star_name];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectUserById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User 
    WHERE id = ?`;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.selectAllUser = (callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User`;

    pool.query(SQLSTATEMENT, callback);
}

module.exports.updateUser = (data, callback) => {
    const SQLSTATEMENT = `
    UPDATE User
    SET username = ?, star_name = ?, points = ?, diamonds = ?
    WHERE id = ?`;

    const VALUES = [data.username, data.star_name, data.points, data.diamonds, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
}

module.exports.updateDiamondsForWinner = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET diamonds = diamonds + ?
        WHERE id = ?
    `;

    // Simply run one query per row using data from controller
    data.values.forEach(([diamonds, user_id]) => {
        pool.query(SQLSTATEMENT, [diamonds, user_id], callback);
    });
};
