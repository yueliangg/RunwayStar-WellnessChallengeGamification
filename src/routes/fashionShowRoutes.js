const express = require('express');
const router = express.Router();
const fashionShowController = require('../controllers/fashionShowController');
const { withMessage, sendResponse } = require('../middleware/response');


/**
 * Route: POST /fashion-show
 * Description: Create a new fashion show
 * Middleware sequence:
 * 1. checkFashionShowName - Ensure the name is unique and valid
 * 2. createFashionShow - Insert the new fashion show into the database
 * 3. getFashionShow - Retrieve the newly created fashion show data
 * 4. withMessage - Attach a success message and status code (201)
 * 5. sendResponse - Send the final response to the client
 */
router.post('/',
    fashionShowController.checkFashionShowName,
    fashionShowController.createFashionShow,
    fashionShowController.getFashionShow,
    withMessage("Fashion Show created successfully.", 201),
    sendResponse
)

/**
 * Route: PUT /fashion-show/:fashion_show_id
 * Description: Update an existing fashion show
 * Middleware sequence:
 * 1. updateFashionShow - Update the fashion show in the database using the provided ID
 * 2. getFashionShow - Retrieve the updated fashion show data
 * 3. withMessage - Attach a success message and status code (200)
 * 4. sendResponse - Send the final response to the client
 */
router.put('/:fashion_show_id',
    fashionShowController.checkFashionShowName,
    fashionShowController.updateFashionShow,
    fashionShowController.getFashionShow,
    withMessage("Fashion Show updated successfully.", 200),
    sendResponse
)

router.get('/',
    fashionShowController.getAllFashionShow,
    withMessage("Fashion Show created successfully.", 200),
    sendResponse
)
module.exports = router;
