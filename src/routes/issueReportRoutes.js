import express from 'express';
import * as issueReportController from '../controllers/issueReportController.js';
import * as assetUnitController from '../controllers/assetUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(issueReportController.getIssueReports));
router.get('/:id', authenticate, asyncHandler(issueReportController.getIssueReportsByAssetUnit));
router.get('/:id/reported-asset', asyncHandler(assetUnitController.getReportedAssetDataById));
router.post('/', asyncHandler(issueReportController.createRequest));
router.post('/update', authenticate, asyncHandler(issueReportController.handleReportApproval));

export default router;
