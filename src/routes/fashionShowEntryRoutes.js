const express = require('express');
const router = express.Router();

const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const fashionShowController = require('../controllers/fashionShowController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const runwayStarController = require('../controllers/runwayStarController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

/**
 * Route: GET /fashion-show-entry/:fashion_show_id
 * Description: Fetch all entries for a specific fashion show
 * Middleware sequence:
 * 1. getFashionShow - Ensure the fashion show exists 
 * 2. getAllUserEntries - Retrieve all user entries for this fashion show
 * 3. withMessage - Attach a success message and status code (200)
 * 4. sendResponse - Send the final response to the client
 */
router.get('/:fashion_show_id',
    fashionShowController.getFashionShow,
    fashionShowEntryController.getAllUserEntries,
    withMessage("All user entries fetched successfully.", 200),
    sendResponse
)

/**
 * Route: POST /fashion-show-entry/:fashion_show_id/enter
 * Description: User enters a fashion show
 * Middleware sequence:
 * 1. checkUserId - Validate that the user exists
 * 2. getFashionShow - Validate that the fashion show exists
 * 3. checkUserEntry - Ensure the user hasn't already entered this fashion show
 * 4. calculateAttractionScore - Calculate the user's attraction score based on items equipped
 * 5. enterFashionShow - Create a new fashion show entry for the user
 * 6. getUserEntry - Retrieve the newly created user entry
 * 7. withMessage - Attach a success message and status code (201)
 * 8. sendResponse - Send the final response to the client
 */
router.post(
    '/:fashion_show_id/enter',
    userController.checkUserId,
    fashionShowController.getFashionShow,
    fashionShowEntryController.checkUserEntry,
    inventoryController.calculateAttractionScore,
    fashionShowEntryController.enterFashionShow,
    fashionShowEntryController.getUserEntry,
    withMessage("User entered Fashion Show Successfully.", 201),
    sendResponse
);

/**
 * Route: DELETE /fashion-show-entry/:fashion_show_id/:user_id
 * Description: Remove a user's entry from a fashion show completely
 * 
 * Middleware flow:
 * 1. checkUserId
 *    - Validates that the user exists
 * 
 * 2. getFashionShow
 *    - Ensures the fashion show exists before attempting deletion
 * 
 * 3. fashionShowEntryController.deleteEntry
 *    - Deletes the user's entry from the FashionShowEntry table
 * 
 * 4. runwayStarController.deleteEntry
 *    - Deletes the corresponding RunwayStar record (if any)
 *    - Prevents orphaned records and keeps data consistent
 * 
 * 5. withMessage
 *    - Attaches a success message and HTTP status code (204)
 * 
 * 6. sendResponse
 *    - Sends the final response back to the client
 */
router.delete('/:fashion_show_id',
    jwtMiddleware.verifyToken,
    userController.checkUserId,
    fashionShowController.getFashionShow,
    fashionShowEntryController.deleteEntry,
    runwayStarController.deleteEntry,
    withMessage("User entry deleted Successfully.", 204),
    sendResponse
);

module.exports = router;
