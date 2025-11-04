import express from 'express';
import * as assetRequestController from '../controllers/assetRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'assetRequests';

router.get('/', assetRequestController.getAssetRequests);
router.get('/:subLocationId/:assetId', assetRequestController.getAssetRequestsByLocationAndAssetId);

router.post('/', asyncHandler(assetRequestController.createRequest, MODULE));
router.post('/update', authenticate, asyncHandler(assetRequestController.handleReportApproval, MODULE));

export default router;
