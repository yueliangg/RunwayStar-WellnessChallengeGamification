const express = require('express');
const router = express.Router();

const itemsController = require('../controllers/itemsController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');

const { withMessage, sendResponse } = require('../middleware/response');

/**
 * Route: GET /items
 * Description: Retrieve all available items in the system
 *
 * Middleware flow:
 * 1. getAllItems
 *    - Fetches all item records from the database
 *
 * 2. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 3. sendResponse
 *    - Sends the list of items to the client
 */
router.get('/', 
    itemsController.getAllItems,
    withMessage('All Items retreived successfully', 200),
    sendResponse
)

/**
 * Route: POST /items
 * Description: Create a new item
 *
 * Middleware flow:
 * 1. checkItemNameExists
 *    - Prevents creation of duplicate item names (409 Conflict)
 *
 * 2. createItem
 *    - Inserts the new item into the database
 *
 * 3. getItem
 *    - Retrieves the newly created item for response
 *
 * 4. withMessage
 *    - Attaches a success message and HTTP 201 status code
 *
 * 5. sendResponse
 *    - Sends the created item data to the client
 */
router.post('/', 
    itemsController.checkItemNameExists,
    itemsController.createItem,
    itemsController.getItem,
    withMessage('Item created successfully', 201),
    sendResponse
);

/**
 * Route: PUT /items/:item_id
 * Description: Update an existing item
 *
 * Middleware flow:
 * 1. checkItemNameExists
 *    - Ensures updated item name does not conflict with other items
 *
 * 2. updateItem
 *    - Updates item details in the database
 *
 * 3. getItem
 *    - Retrieves the updated item for response
 *
 * 4. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 5. sendResponse
 *    - Sends the updated item data to the client
 */
router.put('/:item_id',
    itemsController.checkItemNameExists,
    itemsController.updateItem,
    itemsController.getItem, 
    withMessage('Item updated successfully', 200),
    sendResponse
);

/**
 * Route: POST /items/:item_id/buy
 * Description: Purchase an item and add it to the user's inventory
 */
router.post(
    '/:item_id/buy',
    userController.checkUserId,                // verify user exists
    itemsController.getItem,           // verify item exists
    inventoryController.checkUserAlreadyOwnsItem, // ensure user hasn't bought this item yet
    itemsController.checkUserHasCurrency,      // verify enough points/diamonds
    itemsController.deductCurrency,            // deduct points/diamonds
    itemsController.addToInventory,            // add item to inventory
    inventoryController.getPurchasedInventoryById,    // fetch record for response
    withMessage('Item purchased successfully', 201),
    sendResponse
);

module.exports = router;