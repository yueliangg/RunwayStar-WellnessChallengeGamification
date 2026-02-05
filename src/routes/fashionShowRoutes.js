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

// Route: PUT /fashion-show/:fashion_show_id
// Description: Update an existing fashion show
router.put('/:fashion_show_id',
    fashionShowController.checkFashionShowName,                 
    fashionShowController.updateFashionShow,           
    fashionShowController.getFashionShow,             
    withMessage("Fashion Show updated successfully.", 200),
    sendResponse
)

// Route: GET /completed
// Description: Get all completed fashion shows
router.get('/completed',
    fashionShowController.getCompletedFashionShow,          
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)

// Route: GET /completed
// Description: Get all ongoing fashion shows
router.get('/ongoing',
    fashionShowController.getOngoingFashionShow,          
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)

// Route: GET /fashion-show
// Description: Get all fashion shows
router.get('/',
    fashionShowController.getAllFashionShow,          
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)

// Route: Delete /fashion-show/:fashion_show_id/delete
// Description: Delete fashion show and its records
router.delete('/:fashion_show_id/delete',
    fashionShowController.checkCompleted,                 
    fashionShowController.deleteFashionShow,           
    fashionShowEntryController.deleteEntryByShow,             
    withMessage("Fashion Show updated successfully.", 200),
    sendResponse
)
module.exports = router;
