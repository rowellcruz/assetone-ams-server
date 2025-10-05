import express from 'express';
import * as reportController from '../controllers/reportController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:reportType', authenticate, asyncHandler(reportController.getReport));

export default router;
