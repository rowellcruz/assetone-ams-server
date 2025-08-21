const express = require('express');
const router = express.Router();
const subLocationController = require('../controllers/subLocationController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(subLocationController.getSubLocations));
router.get('/:id', authenticate, asyncHandler(subLocationController.getSubLocationByID));
router.get('/by-location/:location_id', authenticate, asyncHandler(subLocationController.getSubLocationsByLocationID));
router.post('/', authenticate, asyncHandler(subLocationController.createSubLocation));
router.post('/bulk-delete', authenticate, asyncHandler(subLocationController.deleteSubLocationsByIDs));
router.patch('/:id', authenticate, asyncHandler(subLocationController.updateSubLocationPartial));
router.delete('/:id', authenticate, asyncHandler(subLocationController.deleteSubLocationByID));

module.exports = router;
