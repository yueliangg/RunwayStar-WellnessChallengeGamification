const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const jwtMiddleware = require('../middleware/jwtMiddleware')
const { withMessage, sendResponse } = require('../middleware/response');

// Route: GET /items
// Description: Retrieve all available items in the system
router.get('/all', 
    itemsController.getNormalItems, 
    itemsController.getExclusiveItems,               
    withMessage('All Items retreived successfully', 200),
    sendResponse
)

// Route: POST /items
// Description: Create a new item
router.post('/', 
    itemsController.checkItemNameExists,        
    itemsController.createItem,               
    itemsController.getItem,                  
    withMessage('Item created successfully', 201),
    sendResponse
);

// Route: PUT /items/:item_id
// Description: Update an existing item
router.put('/:item_id',
    itemsController.checkItemNameExists,         
    itemsController.updateItem,                 
    itemsController.getItem,                 
    withMessage('Item updated successfully', 200),
    sendResponse
);

// Route: POST /items/:item_id/buy
// Description: Purchase an item and add it to the user's inventory
router.post(
    '/:item_id/buy',
    jwtMiddleware.verifyToken,
    userController.checkUserId,                  
    itemsController.getItem,                   
    inventoryController.checkUserAlreadyOwnsItem,  
    itemsController.checkUserHasCurrency,      
    itemsController.deductCurrency,              
    itemsController.addToInventory,               
    inventoryController.getPurchasedInventoryById, 
    withMessage('Item purchased successfully', 201),
    sendResponse
);

module.exports = router;