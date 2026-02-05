const pool = require('../services/db');

// Get inventory record by user_id and item_id
module.exports.selectInventoryByItem = (data, callback) => {
    const SQL = `
        SELECT * FROM Inventory i
        WHERE i.user_id = ? AND i.item_id = ?
    `;
    const VALUES = [data.user_id, data.item_id];
    pool.query(SQL, VALUES, callback);
};

// get all inventory items for a user
module.exports.selectUserInventory = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT 
            i.id AS inventory_id, 
            i.user_id,
            i.is_equipped, 
            it.name, 
            it.type, 
            it.attraction_value
        FROM Inventory i
        INNER JOIN Items it ON i.item_id = it.id
        WHERE i.user_id = ?
    `;
    const VALUES = [data.user_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get puchased inventory record
module.exports.selectPurchasedInventoryById = (data, callback) => {
    const SQL = `
        SELECT 
            i.id AS inventory_id,
            i.user_id,
            i.item_id,
            i.is_equipped,
            it.name,
            it.type,
            it.attraction_value
        FROM Inventory i
        INNER JOIN Items it ON i.item_id = it.id
        WHERE i.id = ?
    `;
    const VALUES = [data.inventory_id];
    pool.query(SQL, VALUES, callback);
};

// Select inventory by ID
module.exports.getInventory = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * 
        FROM Inventory
        WHERE id = ?
    `;
    const VALUES = [data.inventory_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//update equip status
module.exports.updateEquipStatus = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Inventory
        SET is_equipped = ?
        WHERE id = ?
    `;
    const VALUES = [data.is_equipped, data.inventory_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};


// Get equipped items helper
module.exports.getEquippedItemsWithScore = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT i.name, i.type, i.attraction_value
        FROM Inventory inv
        JOIN Items i ON inv.item_id = i.id
        WHERE inv.user_id = ? AND inv.is_equipped = 1
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};
