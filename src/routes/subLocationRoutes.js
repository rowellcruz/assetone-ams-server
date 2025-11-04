import express from 'express';
import * as subLocationController from '../controllers/subLocationController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'subLocations';

router.get('/', authenticate, asyncHandler(subLocationController.getSubLocations));
router.get('/:id', authenticate, asyncHandler(subLocationController.getSubLocationByID));
router.get('/by-location/:location_id', authenticate, asyncHandler(subLocationController.getSubLocationsByLocationID));
router.get('/:id/requests', authenticate, asyncHandler(subLocationController.getAssetRequestByLocationId));

router.post('/', authenticate, asyncHandler(subLocationController.createSubLocation, MODULE));
router.post('/:id/deliver', authenticate, asyncHandler(subLocationController.deliverUnits, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(subLocationController.deleteSubLocationsByIDs, MODULE));

router.patch('/:id', authenticate, asyncHandler(subLocationController.updateSubLocationPartial, MODULE));
router.patch('/:id/approve', authenticate, asyncHandler(subLocationController.updateSubLocationAssetPartial, MODULE));

router.delete('/:id', authenticate, asyncHandler(subLocationController.deleteSubLocationByID, MODULE));

export default router;
