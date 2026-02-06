const express = require('express');
const router = express.Router();

const runwayStarController = require('../controllers/runwayStarController');
const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const fashionShowController = require('../controllers/fashionShowController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

// Route: POST /runway-star/finalize
// Description: Finalizes a fashion show by ranking the top 3 entries and distributing rewards.
router.post(
    '/finalize',
    fashionShowController.getFashionShow,           
    fashionShowController.checkCompleted,
    fashionShowController.checkParticipants,         
    fashionShowEntryController.getTop3Entries,      
    runwayStarController.insertTop3RunwayStars,
    fashionShowController.updateStatus,   
    userController.updateDiamondsForWinners,     
    runwayStarController.getFinalsByFashionShow,    
    withMessage("Top 3 ranked and rewards distributed", 200),
    sendResponse
);

// Route: GET /runway-star/:fashion_show_id
// Description: Retrieve the finalized top 3 runway stars for a specific fashion show
router.get('/:fashion_show_id',
    fashionShowController.getFashionShow,           
    runwayStarController.getFinalsByFashionShow,    
    withMessage("Top 3 ranked runway stars fetched successfully", 200),
    sendResponse
);

// Route: GET /runway-star/:fashion_show_id/user-rank
// Description: Retrieve the rank by user and fashion_show_id
router.get('/:fashion_show_id/user-rank',
    jwtMiddleware.verifyToken,
    userController.checkUserId,      
    fashionShowController.getFashionShow,
    fashionShowController.checkOngoing,
    runwayStarController.getUserRank,       
    withMessage("Top 3 ranked runway stars fetched successfully", 200),
    sendResponse
);

module.exports = router;
