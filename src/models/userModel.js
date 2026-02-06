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

//Insert New User
module.exports.insertUser = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO User (username, email, password, star_name)
        VALUES (?, ?, ?, ?);
    `;

    const VALUES = [
        data.username,
        data.email,
        data.password,
        data.star_name
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select user by id
module.exports.selectUserById = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User 
    WHERE id = ?`;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select all user
module.exports.selectAllUser = (callback) => {
    const SQLSTATEMENT = `
    SELECT * FROM User`;

    pool.query(SQLSTATEMENT, callback);
}

// Update user starname 
module.exports.updateUser = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET star_name = ?
        WHERE id = ?
    `;

    const VALUES = [data.star_name, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update user's diamonds 
module.exports.updateDiamondsForWinner = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET diamonds = diamonds + ?
        WHERE id = ?
    `;

    const VALUES = [data.diamonds, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update user's attraction score
module.exports.updateAttractionScore = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET attraction_score = ?
        WHERE id = ?
    `;

    const VALUES = [data.attraction_score, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update Avatar
module.exports.updateAvatar = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET profile_avatar = ?
        WHERE id = ?
    `;
    
    const VALUES = [data.avatar, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get challenge points
module.exports.getChallengePoints = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT wc.points
        FROM WellnessChallenge wc
        INNER JOIN User u
            ON u.id = ?
        WHERE wc.id = ?
    `;

    const VALUES = [
        data.user_id,
        data.challenge_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update user's points
module.exports.updateUserPoints = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE \`User\`
        SET points = points - ?
        WHERE id = ?
    `;

    const VALUES = [data.points, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, (err, result) => {
        if (err) {
            console.error("SQL error:", err);
            return callback(err);
        }
        console.log("SQL result:", result);
        callback(null, result);
    });
};




