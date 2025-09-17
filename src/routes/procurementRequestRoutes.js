import express from 'express';
import * as procurementRequestController from '../controllers/procurementRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(procurementRequestController.getProcurementRequests));

export default router;
