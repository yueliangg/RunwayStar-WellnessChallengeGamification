const express = require('express');
const router = express.Router();
const fashionShowController = require('../controllers/fashionShowController');
const fashionShowEntryController = require('../controllers/fashionShowEntryController');
const { withMessage, sendResponse } = require('../middleware/response');

// Route: POST /fashion-show
// Description: Create a new fashion show
router.post('/',
    fashionShowController.checkFashionShowName,        
    fashionShowController.createFashionShow,       
    fashionShowController.getFashionShow,            
    withMessage("Fashion Show created successfully.", 201),
    sendResponse
)

// Route: GET /fashion-show/all
// Description: Get all fashion shows
router.get('/all',
    fashionShowController.getOngoingFashionShow,
    fashionShowController.getCompletedFashionShow,          
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)

module.exports = router;
