const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const userController = require('../controllers/userController');

const { withMessage, sendResponse } = require('../middleware/response');

/**
 * Route: GET /inventory/:user_id
 * Description: Retrieve the full inventory for a specific user
 *
 * Middleware flow:
 * 1. checkUserId
 *    - Validates that the user exists
 *
 * 2. getInventoryByUser
 *    - Fetches all inventory items belonging to the user
 *
 * 3. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 4. sendResponse
 *    - Sends the response back to the client
 */
router.get('/:user_id',
    userController.checkUserId,
    inventoryController.getInventoryByUser,
    withMessage('User inventory retrieved successfully', 200),
    sendResponse
);

/**
 * Route: PUT /inventory/:inventory_id/update-equip
 * Description: Update the equip status of an inventory item
 *
 * Middleware flow:
 * 1. checkUserId
 *    - Ensures the user performing the action exists
 *
 * 2. checkInventory
 *    - Verifies the inventory item exists
 *    - Ensures the item belongs to the user (403)
 *
 * 3. updateEquipStatus
 *    - Updates is_equipped field (0 or 1)
 *    - Handles equip conflicts (409)
 *
 * 4. getInventoryById
 *    - Retrieves the updated inventory item
 *
 * 5. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 6. sendResponse
 *    - Sends the updated inventory data to the client
 */
router.put(
  "/:inventory_id/update-equip",
  userController.checkUserId,
  inventoryController.checkInventory, //404, 403
  inventoryController.updateEquipStatus, //409
  inventoryController.getInventoryById,
  withMessage("Item equip status updated", 200),
  sendResponse
);

/**
 * Route: GET /inventory/:user_id/attraction-score
 * Description: Calculate the user's total attraction score
 *              based on currently equipped items
 *
 * Middleware flow:
 * 1. checkUserId
 *    - Validates that the user exists
 *
 * 2. calculateAttractionScore
 *    - Calculates total attraction score from equipped items only
 *
 * 3. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 4. sendResponse
 *    - Sends the calculated attraction score to the client
 */
router.get(
    '/:user_id/attraction-score',
    userController.checkUserId,
    inventoryController.calculateAttractionScore,
    withMessage("Item equip status updated", 200),
    sendResponse

);

module.exports = router;
