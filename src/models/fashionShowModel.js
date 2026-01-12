const pool = require('../services/db');


module.exports.selectFashionShowByName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
        WHERE description = ?
    `;
    const VALUES = [data.description]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

module.exports.selectFashionShow = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
        WHERE id = ?
    `;
    const VALUES = [data.show_id]
    pool.query(SQLSTATEMENT, VALUES , callback);
};

module.exports.selectAllFashionShow = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM FashionShow
    `;
    pool.query(SQLSTATEMENT, callback);
};
module.exports.insertFashionShow = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO FashionShow (date, description)
    VALUES (?, ?);
    `;
    const VALUES = [data.date, data.description];

    pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateFashionShow = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE FashionShow
    SET date = ?, description = ?
    WHERE id = ?
    `;
    const VALUES = [data.date, data.description, data.show_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}
