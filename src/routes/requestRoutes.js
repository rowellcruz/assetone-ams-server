import express from 'express';
import * as requestController from '../controllers/requestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(requestController.getIssueReports));
router.get('/:id', authenticate, asyncHandler(requestController.getRequestsByAssetUnit));
router.post('/:id/update', authenticate, asyncHandler(requestController.handleReportApproval));

export default router;
