const model = require('../models/itemsModel');

// GET all items
module.exports.getAllItems = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.log("Error getAllItems: ", error);
            return res.status(500).json(error);
        }
        res.locals.data = results;
        next();
    };

    model.selectAllItems(callback);
};

//Creating New Item
module.exports.createItem = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.type == undefined ||
        req.body.cost_points == undefined ||
        req.body.cost_diamonds == undefined ||
        req.body.attraction_value == undefined) {
        return res.status(400).json({ message: "Not enough fields provided for update" });
    }

    const data = {
        name: req.body.name,
        type: req.body.type,
        cost_points: req.body.cost_points,
        cost_diamonds: req.body.cost_diamonds,
        attraction_value: req.body.attraction_value
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error createItem:", error);
            return res.status(500).json(error);
        }

        res.locals.item_id = results.insertId; // store inserted ID
        next();
    };

    model.insertItem(data, callback);
};

// Update Item
module.exports.updateItem = (req, res, next) => {
    if (req.body.name == undefined ||
        req.body.type == undefined ||
        req.body.cost_points == undefined ||
        req.body.cost_diamonds == undefined ||
        req.body.attraction_value == undefined) {
        return res.status(400).json({ message: "Not enough fields provided for update" });
    }

    const data = {
        name: req.body.name,
        type: req.body.type,
        cost_points: req.body.cost_points,
        cost_diamonds: req.body.cost_diamonds,
        attraction_value: req.body.attraction_value,
        item_id: req.params.item_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error updateItem:", error);
            return res.status(500).json(error);
        }

        next();
    };

    model.updateItem(data, callback);
};

// Get single item by ID
module.exports.getItem = (req, res, next) => {
    const data = { 
        item_id: req.params.item_id || res.locals.item_id 
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getItem:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.locals.item = results[0];
        res.locals.data = results[0];
        next();
    };

    model.selectItemById(data, callback);
};

// GET single item by ID
module.exports.checkItemNameExists = (req, res, next) => {
    const data = { 
        name: req.body.name
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkItemNameExists: ", error);
            return res.status(500).json(error);
        }
        if (results.length > 0) 
            return res.status(409).json({message: "Item name already exists"});

        res.locals.item = results[0];
        next();
    };

    model.selectItemByName(data, callback);
};

//  Check if user has enough points/diamonds
module.exports.checkUserHasCurrency = (req, res, next) => {
    const data = { 
        user_id: req.body.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkUserHasCurrency: ", error);
            return res.status(500).json(error);
        }

        if (results[0].points < res.locals.item.cost_points)
            return res.status(422).json({message: "Not enough points"});
        if (results[0].diamonds < res.locals.item.cost_diamonds)
            return res.status(422).json({message: "Not enough diamonds"});

        next();
    };

    model.getUserCurrency(data, callback);
};

// Deduct points/diamonds 
module.exports.deductCurrency = (req, res, next) => {
    const user = res.locals.user;
    const item = res.locals.item;

    const data = {
        user_id: user.id,
        cost_points: item.cost_points,
        cost_diamonds: item.cost_diamonds
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error deduct currency: ", error);
            return res.status(500).json(error);
        }

        user.points = Number(user.points) - Number(item.cost_points);
        user.diamonds = Number(user.diamonds) - Number(item.cost_diamonds);
        res.locals.user = user;
        next();
    };

    model.deductCurrency(data, callback);
};


// Add item to inventory
module.exports.addToInventory = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        item_id: req.params.item_id,
        is_equipped: false
    };
    const callback = (error, results) => {
        if (error) {
            console.log("Error add to inventory: ", error);
            return res.status(500).json(error);
        }
        res.locals.inventory_id = results.insertId;
        next();
    };

    model.addToInventory(data, callback);
};
