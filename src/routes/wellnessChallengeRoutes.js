const express = require('express');
const router = express.Router();


const wellnessController = require('../controllers/wellnessChallengeController');
const userController = require('../controllers/userController');
const { withMessage, sendResponse } = require('../middleware/response');

// 5. POST /challenges
// Description: Creates a new wellness challenge.
router.post('/',
    wellnessController.createChallenge,   
    wellnessController.getChallenge,      
    withMessage("Challenge created successfully", 201),
    sendResponse
);

// 6. GET /challenges
// Description: Fetches all wellness challenges available in the system.
router.get('/',
    wellnessController.getAllChallenges,  
    withMessage("All Challenge fetched successfully", 200),
    sendResponse
);

// 7. DELETE /challenges/{challenge_id}
// Description: Deletes a specific challenge and user completion if any
router.delete('/:challenge_id',
    wellnessController.deleteChallenge,   
    wellnessController.deleteUserCompletion,   
    withMessage("Challenge delete successfulyy", 204),
    sendResponse
);

// 8. PUT /challenges/{challenge_id}
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

// 9. POST /challenges/{challenge_id}
// Description: Creates a completion record when a user completes a challenge and rewards points to the user
router.post(
    "/:challenge_id",
    wellnessController.checkChallengeExists,  
    userController.checkUserId,               
    wellnessController.createRecord,         
    wellnessController.rewardPoints,         
    wellnessController.getRecord,            
    withMessage("Record created successfully", 201),
    sendResponse
);

// 10. GET /challenges/{challenge_id}
// Description: Retrieves all completion records for a specific challenge.
router.get(
    "/:challenge_id",
    wellnessController.checkChallengeExists, 
    wellnessController.getAllCompletions,     
    withMessage("Records retrieved successfully", 200),
    sendResponse
);

module.exports = router;
