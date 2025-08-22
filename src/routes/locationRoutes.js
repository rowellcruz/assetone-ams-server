import express from 'express';
import * as locationController from '../controllers/locationController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(locationController.getLocations));
router.get('/:id', authenticate, asyncHandler(locationController.getLocationByID));
router.post('/', authenticate, asyncHandler(locationController.createLocation));
router.post('/bulk-delete', authenticate, asyncHandler(locationController.deleteLocationsByIDs));
router.put('/:id', authenticate, asyncHandler(locationController.replaceLocation));
router.patch('/:id', authenticate, asyncHandler(locationController.updateLocationPartial));
router.delete('/:id', authenticate, asyncHandler(locationController.deleteLocationByID));

export default router;
