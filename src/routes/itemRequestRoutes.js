import express from 'express';
import * as assetRequestController from '../controllers/assetRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(assetRequestController.getAssetRequests));
router.get('/:subLocationId/:assetId', asyncHandler(assetRequestController.getAssetRequestsByLocationAndAssetId));
router.post('/', asyncHandler(assetRequestController.createRequest));
router.post('/update', authenticate, asyncHandler(assetRequestController.handleReportApproval));

export default router;
