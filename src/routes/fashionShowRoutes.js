const express = require('express');
const router = express.Router();
const fashionShowController = require('../controllers/fashionShowController');
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

// Route: GET /fashion-show
// Description: Get all fashion shows
router.get('/',
    fashionShowController.getAllFashionShow,          
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)
module.exports = router;
