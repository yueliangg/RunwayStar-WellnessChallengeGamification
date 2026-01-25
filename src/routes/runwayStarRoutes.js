const express = require('express');
const router = express.Router();

const runwayStarController = require('../controllers/runwayStarController');
const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const fashionShowController = require('../controllers/fashionShowController');
const userController = require('../controllers/userController');

const { withMessage, sendResponse } = require('../middleware/response');

// Route: POST /runway-star/finalize
// Description: Finalizes a fashion show by ranking the top 3 entries and distributing rewards.
router.post(
    '/finalize',
    fashionShowController.getFashionShow,           //Validates that the fashion show exists
    runwayStarController.checkNotFinalized,         // prevent double adding the diamonds
    fashionShowEntryController.getTop3Entries,      // fetch top 3 from FashionShowEntry
    runwayStarController.insertTop3RunwayStars,     // insert top 3 into RunwayStar
    userController.updateDiamondsForWinners,        // add diamonds to User table
    runwayStarController.getFinalsByFashionShow,    //Fetches the top 3 ranked runway stars for the specified fashion show
    withMessage("Top 3 ranked and rewards distributed", 200),
    sendResponse
);

// Route: GET /runway-star/:fashion_show_id
// Description: Retrieve the finalized top 3 runway stars for a specific fashion show
router.get('/:fashion_show_id',
    fashionShowController.getFashionShow,           //Validates that the fashion show exists
    runwayStarController.getFinalsByFashionShow,    //Fetches the top 3 ranked runway stars for the specified fashion show
    withMessage("Top 3 ranked runway stars fetched successfully", 200),
    sendResponse
);

// Route: GET /runway-star
// Description: Retrieve finalized top 3 runway stars for all fashion shows
router.get('/',
    runwayStarController.getAllFinals,               //Fetches all finalized runway star records
    withMessage("Top 3 ranked runway stars for all fashion shows fetched successfully", 200),
    sendResponse
);

module.exports = router;
