const express = require('express');
const router = express.Router();

const runwayStarController = require('../controllers/runwayStarController');
const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const fashionShowController = require('../controllers/fashionShowController');
const userController = require('../controllers/userController');

const { withMessage, sendResponse } = require('../middleware/response');

/**
 * Route: POST /runway-star/finalize
 * Description: Finalize a fashion show by selecting the top 3 runway stars
 *              and distributing diamond rewards to the winners.
 *
 * Middleware flow:
 * 1. getFashionShow
 *    - Validates that the fashion show exists
 *
 * 2. checkNotFinalized
 *    - Prevents finalization if rewards have already been distributed
 *
 * 3. getTop3Entries
 *    - Retrieves the top 3 users based on attraction score from FashionShowEntry
 *
 * 4. insertTop3RunwayStars
 *    - Stores the final rankings and rewards in the RunwayStar table
 *
 * 5. updateDiamondsForWinners
 *    - Updates the User table by adding diamonds to the top 3 winners
 *
 * 6. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 7. sendResponse
 *    - Sends confirmation response to the client
 */
router.post(
    '/finalize',
    fashionShowController.getFashionShow,
    runwayStarController.checkNotFinalized,         // prevent double adding the diamonds
    fashionShowEntryController.getTop3Entries,      // fetch top 3 from FashionShowEntry
    runwayStarController.insertTop3RunwayStars,     // insert top 3 into RunwayStar
    userController.updateDiamondsForWinners,        // add diamonds to User table
    withMessage("Top 3 ranked and rewards distributed", 200),
    sendResponse
);

/**
 * Route: GET /runway-star/:fashion_show_id
 * Description: Retrieve the finalized top 3 runway stars for a specific fashion show
 *
 * Middleware flow:
 * 1. getFashionShow
 *    - Validates that the fashion show exists
 *
 * 2. getFinalsByFashionShow
 *    - Fetches the top 3 ranked runway stars for the specified fashion show
 *
 * 3. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 4. sendResponse
 *    - Sends the top 3 results to the client
 */
router.get('/:fashion_show_id',
    fashionShowController.getFashionShow,
    runwayStarController.getFinalsByFashionShow,
    withMessage("Top 3 ranked runway stars fetched successfully", 200),
    sendResponse
);

/**
 * Route: GET /runway-star
 * Description: Retrieve finalized top 3 runway stars for all fashion shows
 *
 * Middleware flow:
 * 1. getAllFinals
 *    - Fetches all finalized runway star records from the database
 *
 * 2. withMessage
 *    - Attaches a success message and HTTP 200 status code
 *
 * 3. sendResponse
 *    - Sends the list of all finalized runway stars to the client
 */
router.get('/',
    runwayStarController.getAllFinals,
    withMessage("Top 3 ranked runway stars for all fashion shows fetched successfully", 200),
    sendResponse
);

module.exports = router;
