const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const exampleController = require('../controllers/exampleController');
const jwtMiddleware = require('../middleware/jwtMiddleware')
const bcryptMiddleware = require('../middleware/bcryptMiddleware');

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
router.get('/',
    jwtMiddleware.verifyToken,
    userController.checkUserId,
    userController.getUser,
    withMessage("Specific User fetched successfully", 200),
    sendResponse
)

//4. PUT /users/{user_id} 
router.put('/',
    jwtMiddleware.verifyToken,
    userController.checkUserId, //checking User Exists
    userController.checkUsername, //Checking Username is not duplicated
    userController.updateUser, //Updating User details
    userController.getUser, //Retrieve the updated user
    withMessage("User Updated successfullly", 200),
    sendResponse
)

router.post("/login", 
    userController.login, 
    bcryptMiddleware.comparePassword, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);

router.post("/register", 
    userController.checkUsernameOrEmailExist, 
    bcryptMiddleware.hashPassword, 
    userController.register, 
    jwtMiddleware.generateToken, 
    jwtMiddleware.sendToken);

router.post("/jwt/generate", 
    exampleController.preTokenGenerate, 
    jwtMiddleware.generateToken, 
    exampleController.beforeSendToken, 
    jwtMiddleware.sendToken
);

router.get("/jwt/verify", 
    jwtMiddleware.verifyToken, 
    exampleController.showTokenVerified
);

router.post("/bcrypt/compare",
    exampleController.preCompare, 
    bcryptMiddleware.comparePassword, 
    exampleController.showCompareSuccess
);

router.post("/bcrypt/hash", 
    bcryptMiddleware.hashPassword, 
    exampleController.showHashing
);

module.exports = router;

