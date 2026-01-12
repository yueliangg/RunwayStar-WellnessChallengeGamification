const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { withMessage, sendResponse } = require('../middleware/response');

//1. POST /users 
//creating 
router.post('/',
    userController.checkUsername, 
    userController.createNewUser, 
    userController.getUser,
    withMessage('User created successfully', 201),
    sendResponse
);

//2. GET /users 
router.get('/',
    userController.getAllUser,
    withMessage('All users fetched successfully', 200),
    sendResponse
)

//3. GET /users/{user_id} 
router.get('/:user_id',
    userController.checkUserId,
    userController.getUser,
    withMessage("Specific User fetched successfully", 200),
    sendResponse
)

//4. PUT /users/{user_id} 
router.put('/:user_id',
    userController.checkUserId, //checking User Exists
    userController.checkUsername, //Checking Username is not duplicated
    userController.updateUser, //Updating User details
    userController.getUser, //Retrieve the updated user
    withMessage("User Updated successfullly", 200),
    sendResponse
)

module.exports = router;

