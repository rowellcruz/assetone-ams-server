import express from 'express';
import * as locationController from '../controllers/locationController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'locations';

router.get('/', authenticate, locationController.getLocations);
router.get('/:id', authenticate, locationController.getLocationByID);

router.post('/', authenticate, asyncHandler(locationController.createLocation, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(locationController.deleteLocationsByIDs, MODULE));
router.put('/:id', authenticate, asyncHandler(locationController.replaceLocation, MODULE));
router.patch('/:id', authenticate, asyncHandler(locationController.updateLocationPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(locationController.deleteLocationByID, MODULE));

export default router;
