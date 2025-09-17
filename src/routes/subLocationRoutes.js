import express from 'express';
import * as subLocationController from '../controllers/subLocationController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(subLocationController.getSubLocations));
router.get('/:id', asyncHandler(subLocationController.getSubLocationByID));
router.get('/by-location/:location_id', authenticate, asyncHandler(subLocationController.getSubLocationsByLocationID));
router.post('/', authenticate, asyncHandler(subLocationController.createSubLocation));
router.post('/bulk-delete', authenticate, asyncHandler(subLocationController.deleteSubLocationsByIDs));
router.patch('/:id', authenticate, asyncHandler(subLocationController.updateSubLocationPartial));
router.delete('/:id', authenticate, asyncHandler(subLocationController.deleteSubLocationByID));

export default router;
