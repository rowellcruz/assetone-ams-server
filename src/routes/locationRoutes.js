const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(locationController.getLocations));
router.get('/:id', authenticate, asyncHandler(locationController.getLocationByID));
router.post('/', authenticate, asyncHandler(locationController.createLocation));
router.post('/bulk-delete', authenticate, asyncHandler(locationController.deleteLocationsByIDs));
router.put('/:id', authenticate, asyncHandler(locationController.replaceLocation));
router.patch('/:id', authenticate, asyncHandler(locationController.updateLocationPartial));
router.delete('/:id', authenticate, asyncHandler(locationController.deleteLocationByID));

module.exports = router;
