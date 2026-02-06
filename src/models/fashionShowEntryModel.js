const pool = require('../services/db');

//Select All UserEntries by Show id
module.exports.selectAllUserEntries = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShowEntry
        WHERE show_id = ? 
    `;

    const VALUES = [data.show_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

//Insert Fashion Show Entry
module.exports.addFashionShowEntry = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO FashionShowEntry (show_id, user_id, attraction_score)
        VALUES (?, ?, ?)
    `;

    const VALUES = [data.show_id, data.user_id, data.attraction_score];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//get fashion show entry by user_id and show_id
module.exports.getFashionShowEntry = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShowEntry
        WHERE show_id = ? AND user_id = ?
    `;
    const VALUES = [data.show_id, data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

//select top 3 attraction score
module.exports.selectTop3ByAttraction = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, attraction_score
        FROM FashionShowEntry
        WHERE show_id = ?
        ORDER BY attraction_score DESC
        LIMIT 3;

    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Delete fashion show entry from DB
module.exports.deleteEntry = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM FashionShowEntry
        WHERE show_id = ? AND user_id = ?
    `;
    const VALUES = [data.fashion_show_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
