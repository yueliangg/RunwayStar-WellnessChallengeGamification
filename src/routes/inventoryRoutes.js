const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware')

const { withMessage, sendResponse } = require('../middleware/response');

// Route: PUT /inventory/update-equip
// Description: Update equip status and recalculate attraction score
router.put(
  "/update-equip",
  jwtMiddleware.verifyToken,
  userController.checkUserId,                       
  inventoryController.checkInventory,              
  inventoryController.updateEquipStatus,
  inventoryController.calculateAttractionScore,   
  userController.updateAttractionScore,                   
  withMessage("Item equip status updated", 200),
  sendResponse
);


module.exports = router;
