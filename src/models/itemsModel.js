const pool = require('../services/db');

// select all items
module.exports.selectAllItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Items
    `;
    pool.query(SQLSTATEMENT, callback);
};

// get item by id
module.exports.selectItemById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Items
        WHERE id = ?
    `;

    const VALUES = [data.item_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// check item by name exists
module.exports.selectItemByName = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Items
        WHERE name = ?
    `;

    const VALUES = [data.name];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Insert Item
module.exports.insertItem = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Items (name, type, cost_points, cost_diamonds, attraction_value)
        VALUES (?, ?, ?, ?, ?)
    `;

    const VALUES = [data.name, data.type, data.cost_points, data.cost_diamonds, data.attraction_value];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update Item
module.exports.updateItem = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Items
        SET name = ?, type = ?, cost_points = ?, cost_diamonds = ?, attraction_value = ?
        WHERE id = ?
    `;
    const VALUES = [data.name, data.type, data.cost_points, data.cost_diamonds, data.attraction_value, data.item_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get user's points and diamonds
module.exports.getUserCurrency = (data, callback) => {
    const SQLSTATEMENT = `
    SELECT points, diamonds 
    FROM User 
    WHERE id = ?`;

    const VALUES = [data.user_id];
    
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Deduct points and diamonds atomically
module.exports.deductCurrency = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE User
        SET points = points - ?, diamonds = diamonds - ?
        WHERE id = ?;
    `;
    const VALUES = [
        data.cost_points,
        data.cost_diamonds,
        data.user_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Add item to inventory
module.exports.addToInventory = (data, callback) => {
    const SQLSTATEMENT = `
    INSERT INTO Inventory (user_id, item_id, is_equipped) 
    VALUES (?, ?, ?)`;

    const VALUES = [data.user_id, data.item_id, data.is_equipped || false];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

module.exports.getNormalItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Items
        WHERE type = 'normal'
        ORDER BY name ASC;
    `;
    pool.query(SQLSTATEMENT, callback);
};

module.exports.getExclusiveItems = (callback) => {
    const SQLSTATEMENT = `
        SELECT *
        FROM Items
        WHERE type = 'exclusive'
        ORDER BY name ASC;
    `;
    pool.query(SQLSTATEMENT, callback);
};

