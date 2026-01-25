const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware')

const { withMessage, sendResponse } = require('../middleware/response');

// Route: GET /inventory/:user_id
// Description: Retrieve the full inventory for a specific user
router.get('/',
    jwtMiddleware.verifyToken,                 
    userController.checkUserId,                     
    inventoryController.getInventoryByUser,         
    withMessage('User inventory retrieved successfully', 200),
    sendResponse
);

// Route: PUT /inventory/:inventory_id/update-equip
// Description: Update the equip status of an inventory item
router.put(
  "/:inventory_id/update-equip",
  userController.checkUserId,                       
  inventoryController.checkInventory,              
  inventoryController.updateEquipStatus,            
  inventoryController.getInventoryById,             
  withMessage("Item equip status updated", 200),
  sendResponse
);

// Route: GET /inventory/:user_id/attraction-score
// Description: Calculate the user's total attraction score based on currently equipped items
router.get(
    '/:user_id/attraction-score',
    userController.checkUserId,                    
    inventoryController.calculateAttractionScore,   
    withMessage("Item equip status updated", 200),
    sendResponse

);

module.exports = router;
