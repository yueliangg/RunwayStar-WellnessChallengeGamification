const express = require('express');
const router = express.Router();
const wellnessController = require('../controllers/wellnessChallengeController')
const userController = require('../controllers/userController')

const { withMessage, sendResponse } = require('../middleware/response');

//5. POST /challenges 
router.post('/', 
    wellnessController.createChallenge,
    wellnessController.getChallenge,
    withMessage("Challenge created successfully", 201),
    sendResponse
)

//6. GET /challenges 
router.get('/', 
    wellnessController.getAllChallenges,
    withMessage("All Challenge fetched successfully", 200),
    sendResponse
)

//7. . DELETE /challenges/{challenge_id} 
router.delete('/:challenge_id',
    wellnessController.deleteChallenge,
    wellnessController.deleteUserCompletion,
    withMessage("Challenge delete successfulyy", 204),
    sendResponse
)

//8. PUT / challenges/:challenges_id
router.put(
    "/:challenge_id",
    wellnessController.checkChallengeExists,
    wellnessController.checkChallengeOwner,
    wellnessController.updateChallenge,
    wellnessController.getChallenge,
    withMessage("Challenge updated successfully", 200),
    sendResponse
);

//User Completion 
//9. POST /challenges/{challenge_id}/ 
//Creating Completion records of the user
router.post(
    "/:challenge_id",
    wellnessController.checkChallengeExists, // validate challenge ID
    userController.checkUserId, //validate userID
    wellnessController.createRecord, // create the completion record
    wellnessController.rewardPoints, //points are rewarded
    wellnessController.getRecord, //get the created record 
    withMessage("Record created successfully", 201),
    sendResponse
);


//10. GET /challenges/{challenge_id}/
//Retreiving all the completion record of certain user
router.get(
    "/:challenge_id",
    wellnessController.checkChallengeExists,
    wellnessController.getAllCompletions,
    withMessage("Records retrieved successfully", 200),
    sendResponse
);

module.exports = router;