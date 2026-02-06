const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middleware/jwtMiddleware');
const wellnessController = require('../controllers/wellnessChallengeController');
const userController = require('../controllers/userController');
const { withMessage, sendResponse } = require('../middleware/response');

// POST /challenges
// Description: Creates a new wellness challenge.
router.post('/create',
    jwtMiddleware.verifyToken,
    wellnessController.createChallenge,   
    wellnessController.getChallenge,      
    withMessage("Challenge created successfully", 201),
    sendResponse
);

// GET /challenges
// Description: Fetches all wellness challenges available in the system.
router.get('/',
    wellnessController.getAllChallenges,  
    withMessage("All Challenge fetched successfully", 200),
    sendResponse
);

// DELETE /challenges/{challenge_id}
// Description: Deletes a specific challenge and user completion if any
router.delete('/:challenge_id',
    wellnessController.deleteChallenge,   
    wellnessController.deleteUserCompletion,   
    withMessage("Challenge delete successfulyy", 204),
    sendResponse
);

// PUT /challenges/{challenge_id}
// Description: Updates an existing challenge.
router.put(
    "/:challenge_id",
    wellnessController.checkChallengeExists, 
    wellnessController.checkChallengeOwner,   
    wellnessController.updateChallenge,      
    wellnessController.getChallenge,          
    withMessage("Challenge updated successfully", 200),
    sendResponse
);

// POST /challenges/{challenge_id}
// Description: Creates a completion record when a user completes a challenge and rewards points to the user
router.post(
    "/:challenge_id/record",
    jwtMiddleware.verifyToken,
    wellnessController.checkChallengeExists,  
    userController.checkUserId,               
    wellnessController.createRecord,         
    wellnessController.rewardPoints,         
    wellnessController.getRecord,            
    withMessage("Record created successfully", 201),
    sendResponse
);

//  DELETE /challenges/{challenge_id}/record
// Description: Deletes user completion
router.delete('/:challenge_id/record',
    jwtMiddleware.verifyToken,
    userController.checkUserId,
    wellnessController.checkCompletionByUser,
    wellnessController.deleteUserCompletionByUser,
    userController.deductPoints,
    userController.updatePoints,   
    withMessage("Challenge delete successfulyy", 204),
    sendResponse
);

module.exports = router;
