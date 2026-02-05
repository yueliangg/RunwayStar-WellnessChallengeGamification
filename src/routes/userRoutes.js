const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fashionShowController = require('../controllers/fashionShowController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

// GET /users
// Description: Fetch all users in the system.
router.get('/',
    userController.getAllUser,        
    withMessage('All users fetched successfully', 200),
    sendResponse
);

// GET /users/me
// Description: Fetch a specific user by user ID after verifying JWT token.
router.get('/me',
    jwtMiddleware.verifyToken,         
    userController.checkUserId,         
    userController.getUser,             
    withMessage("Specific user fetched successfully", 200),
    sendResponse
);

// PUT /users/
// Description: Update starname
// after verifying JWT token, ensuring username is not duplicated, 
// then returning the updated user.
router.put('/',
    jwtMiddleware.verifyToken,          
    userController.checkUserId,  
    userController.updateUser,         
    userController.getUser,            
    withMessage("User updated successfully", 200),
    sendResponse
);

// GET /users/me/fashion-show
// Description: get all fashion shows that user Joined
// GET /users/me/fashion-show
router.get(
    '/fashion-show',
    jwtMiddleware.verifyToken,
    userController.checkUserId,        
    fashionShowController.getFashionShowUser,              
    withMessage("Fashion-shows by user fetched successfully", 200),
    sendResponse
);

// POST /users/update-avator
router.put("/update-avatar", 
    jwtMiddleware.verifyToken,
    userController.updateAvatar);

module.exports = router;
