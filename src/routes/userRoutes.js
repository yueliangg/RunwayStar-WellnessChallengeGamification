const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fashionShowController = require('../controllers/fashionShowController');
const wellnessController = require('../controllers/wellnessChallengeController');
const inventoryController = require('../controllers/inventoryController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

// GET /users/me
// Description: Fetch a specific user and details
router.get('/me',
    jwtMiddleware.verifyToken,         
    userController.checkUserId,         
    userController.getUser,
    wellnessController.getAllCompletionsByUser,
    inventoryController.getInventoryByUser,  
    fashionShowController.getFashionShowUser,               
    withMessage("Specific user fetched successfully", 200),
    sendResponse
);

// PUT /users/
// Description: Update starname after verifying token
router.put('/',
    jwtMiddleware.verifyToken,          
    userController.checkUserId,  
    userController.updateUser,        
    userController.getUser,            
    withMessage("User updated successfully", 200),
    sendResponse
);

// PUT /users/update-avator
router.put("/update-avatar", 
    jwtMiddleware.verifyToken,
    userController.updateAvatar,
    withMessage("User updated successfully", 200),
    sendResponse
);

module.exports = router;
