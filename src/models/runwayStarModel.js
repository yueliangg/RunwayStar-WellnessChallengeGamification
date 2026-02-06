const pool = require("../services/db");

//select runwaystars by show WITH fashion show details
module.exports.selectRunwayStarsByShow = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            u.username, 
            u.star_name, 
            rs.*,
            fs.id as id,
            fs.date,
            fs.description,
            fs.status,
            fs.participants
        FROM RunwayStar rs
        INNER JOIN User u ON rs.user_id = u.id
        INNER JOIN FashionShow fs ON rs.show_id = fs.id
        WHERE rs.show_id = ?
        ORDER BY rs.final_rank ASC
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

//delete entry
module.exports.deleteEntry = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM RunwayStar
        WHERE show_id = ? AND user_id = ?
    `;

    const VALUES = [data.fashion_show_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//Get rank
module.exports.getUserRank = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            rs.user_id,
            rs.total_attraction,
            fs.status,
            rs.final_rank
        FROM RunwayStar rs
        INNER JOIN FashionShow fs 
            ON rs.show_id = fs.id
        WHERE rs.show_id = ? AND rs.user_id = ?
    `;
    
    const VALUES = [data.fashion_show_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

