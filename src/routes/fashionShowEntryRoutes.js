const express = require('express');
const router = express.Router();

const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const fashionShowController = require('../controllers/fashionShowController');
const userController = require('../controllers/userController');
const inventoryController = require('../controllers/inventoryController');
const runwayStarController = require('../controllers/runwayStarController');
const jwtMiddleware = require('../middleware/jwtMiddleware');

const { withMessage, sendResponse } = require('../middleware/response');

// Route: GET /fashion-show-entry/:fashion_show_id
// Description: Fetch all entries for a specific fashion show
router.get('/:fashion_show_id',
    fashionShowController.getFashionShow,           
    fashionShowEntryController.getAllUserEntries,  
    withMessage("All user entries fetched successfully.", 200),
    sendResponse
)

// Route: POST /fashion-show-entry/enter
// Description: User enters a fashion show
router.post('/enter',
    jwtMiddleware.verifyToken,
    userController.checkUserId,                    
    fashionShowController.getFashionShow,          
    fashionShowEntryController.checkUserEntry,     
    inventoryController.calculateAttractionScore,   
    fashionShowEntryController.enterFashionShow,
    fashionShowController.addParticipants,    
    fashionShowEntryController.getUserEntry,      
    withMessage("User entered Fashion Show Successfully.", 201),
    sendResponse
);

// Route: DELETE /fashion-show-entry/:fashion_show_id
// Description: Remove a user's entry from a fashion show completely
router.delete('/:fashion_show_id',
    jwtMiddleware.verifyToken,
    userController.checkUserId,
    fashionShowController.checkCompleted,                    
    fashionShowController.getFashionShow,
    fashionShowController.reduceParticipants,          
    fashionShowEntryController.deleteEntry,          
    withMessage("User entry deleted Successfully.", 204),
    sendResponse
);

module.exports = router;
