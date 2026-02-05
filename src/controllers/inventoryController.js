const model = require('../models/inventoryModel');

// Check user has not bought this item yet
module.exports.checkUserAlreadyOwnsItem = (req, res, next) => {
    const data = {
        user_id: res.locals.userId || req.body.user_id,
        item_id: req.params.item_id
    };

    const callback = (error, results) => {
        if (error){
            console.log("Error checkUserAlreadyOwnsItem: ", error);
            return res.status(500).json(error);
        }
            
        if (results.length > 0)
            return res.status(409).json({ message: "User already owns this item" });
        next();
    };
    model.selectInventoryByItem(data, callback);
};

// get user inventory by user
module.exports.getInventoryByUser = (req, res, next) => {
    const data = {
        user_id: res.locals.userId
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error getInventory: ", error);
            return res.status(500).json(error);
        }
        res.locals.data = results;
        next();
    };

    model.selectUserInventory(data, callback);
};

// Get inventory record by inventory insertId 
module.exports.getPurchasedInventoryById = (req, res, next) => {
    const data = {
        inventory_id: res.locals.inventory_id  // insertId set by addToInventory
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error getInventory:", error);
            return res.status(500).json(error);
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "Inventory record not found" });
        }

        const item = res.locals.item;
        const user = res.locals.user;

        res.locals.data = {
            inventory_id: results[0].inventory_id,
            user_id: results[0].user_id,
            item_id: results[0].item_id,
            is_equipped: results[0].is_equipped,
            name: results[0].name,
            type: results[0].type,
            attraction_value: results[0].attraction_value,
            points_spent: item.cost_points,
            remaining_points: user.points,
            remaining_diamonds: user.diamonds
        };

        next();
    };

    model.selectPurchasedInventoryById(data, callback);
};

// Check if inventory item exists and ownership
module.exports.checkInventory = (req, res, next) => {
    const data = {
        inventory_id: req.body.inventory_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkInventoryExists:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        if (results[0].user_id !== res.locals.userId)
            return res.status(403).json({ message: "You are not the owner." });

        // Attach inventory row to res.locals
        res.locals.inventory = results[0];
        next();
    };

    model.getInventory(data, callback);
};

// Update equip status (explicit 0 / 1)
module.exports.updateEquipStatus = (req, res, next) => {
    const inventory = res.locals.inventory;

    const data = {
        inventory_id: req.body.inventory_id,
        is_equipped: req.body.is_equipped
    };

    // Validate value
    if (req.body.is_equipped !== 0 && req.body.is_equipped !== 1) {
        return res.status(400).json({ message: "Invalid is_equipped value" });
    }

    // Already same state
    if (inventory.is_equipped === req.body.is_equipped) {
        return res.status(409).json({
            message: req.body.is_equipped === 1
                ? "Item is already equipped"
                : "Item is already unequipped"
        });
    }

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateEquipStatus:", error);
            return res.status(500).json(error);
        }

        next();
    };

    model.updateEquipStatus(data, callback);
};

//get inventory by inventory Id
module.exports.getInventoryById = (req, res, next) => {
    const data = {
        inventory_id: req.body.inventory_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getInventoryById:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.locals.data = results[0];
        next();
    };

    model.getInventory(data, callback);
};

// Calculate attraction score middleware
module.exports.calculateAttractionScore = (req, res, next) => {
    const data = {
        user_id: res.locals.userId || req.body.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error calculateAttractionScore:", error);
            return res.status(500).json(error); // still return error immediately
        }

        // Sum the attraction values
        const total_score = results.reduce((sum, item) => sum + item.attraction_value, 0);

        // Store values in res.locals for the next middleware
        res.locals.total_score = total_score;
        res.locals.items = results;
        res.locals.user_id = data.user_id;

        res.locals.data = {
            user_id: data.user_id,
            total_score: total_score,
            items: results
        };
        
        next();
    };

    model.getEquippedItemsWithScore(data, callback);
};
