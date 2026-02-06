const pool = require('../services/db');

//selection fashion show by name
module.exports.selectFashionShowByName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
        WHERE description = ?
    `;
    const VALUES = [data.description]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

//select fashion show by id
module.exports.selectFashionShow = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
        WHERE id = ?
    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

//select all fashion show
module.exports.selectAllFashionShow = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
    `;
    pool.query(SQLSTATEMENT, callback);
};

//Insert new fashion show
module.exports.insertFashionShow = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO FashionShow (date, description)
    VALUES (?, ?);
    `;
    const VALUES = [data.date, data.description];

    pool.query(SQLSTATMENT, VALUES, callback);
}

//select fashion show by user
module.exports.selectFashionShowByUser = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow fs
        INNER JOIN FashionShowEntry fse
            ON fs.id = fse.show_id
        WHERE fse.user_id = ?;

    `;
    const VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

// add participants
module.exports.addParticipants = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE FashionShow
        SET participants = participants + 1
        WHERE id = ?
    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

// substract participants
module.exports.reduceParticipants = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE FashionShow
        SET participants = participants - 1
        WHERE id = ?
    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

// update as completed to status
module.exports.updateStatus = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE FashionShow
        SET status = 'completed'
        WHERE id = ?
    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

// Select Completed Fashion Shows 
module.exports.selectCompletedFashionShow = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM FashionShow
        WHERE status = 'completed'
        ORDER BY date DESC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// Select Ongoing Fashion Shows-
module.exports.selectOngoingFashionShow = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM FashionShow
        WHERE status = 'ongoing'
        ORDER BY date ASC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

