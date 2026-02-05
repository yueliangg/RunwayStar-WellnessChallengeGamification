const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const bcryptMiddleware = require('../middleware/bcryptMiddleware');

// POST /authetication/login
// Description: Authenticate a user by checking login credentials, 
// comparing password with stored hash, generating a JWT token, 
// and sending the token back to the client.
router.post("/login", 
    userController.login,             
    bcryptMiddleware.comparePassword,  
    jwtMiddleware.generateToken,      
    jwtMiddleware.sendToken            
);

// POST /authentication/register
// Description: Register a new user by checking username/email availability, 
// hashing the password, creating the user record, generating a JWT token, 
// and sending the token back to the client.
router.post("/register", 
    userController.checkUsernameOrEmailExist, 
    bcryptMiddleware.hashPassword,          
    userController.register,                  
    jwtMiddleware.generateToken,              
    jwtMiddleware.sendToken                 
);

module.exports = router;
