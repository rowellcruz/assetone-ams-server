import express from 'express';
import * as assetRequestController from '../controllers/assetRequestController.js';
import * as assetController from '../controllers/assetController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(assetRequestController.getAssetRequests));
router.get('/public', asyncHandler(assetController.getPublicAssets));
router.get('/:subLocationId/:assetId', asyncHandler(assetRequestController.getAssetRequestsByLocationAndAssetId));
router.post('/', asyncHandler(assetRequestController.createRequest));
router.post('/update', authenticate, asyncHandler(assetRequestController.handleReportApproval));

export default router;
