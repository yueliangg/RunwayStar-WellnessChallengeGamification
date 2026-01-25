const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const bcryptMiddleware = require('../middleware/bcryptMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

//1. POST /users
// Description: Create a new user by checking if username is available, 
// hashing password, storing user data, and returning the created user.
router.post('/',
    userController.checkUsername,       
    userController.createNewUser,      
    userController.getUser,            
    withMessage('User created successfully', 201),
    sendResponse
);

//2. GET /users
// Description: Fetch all users in the system.
router.get('/',
    userController.getAllUser,        
    withMessage('All users fetched successfully', 200),
    sendResponse
);

//3. GET /users/{user_id}
// Description: Fetch a specific user by user ID after verifying JWT token.
router.get('/user',
    jwtMiddleware.verifyToken,         
    userController.checkUserId,         
    userController.getUser,             
    withMessage("Specific user fetched successfully", 200),
    sendResponse
);

//4. PUT /users/{user_id}
// Description: Update a user's details (username, star_name, points, diamonds) 
// after verifying JWT token, ensuring username is not duplicated, 
// then returning the updated user.
router.put('/',
    jwtMiddleware.verifyToken,          
    userController.checkUserId,         
    userController.checkUsername,   
    userController.updateUser,         
    userController.getUser,            
    withMessage("User updated successfully", 200),
    sendResponse
);

module.exports = router;
