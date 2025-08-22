import express from 'express';
import { getCompletionRequests } from '../controllers/completionRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(getCompletionRequests));

export default router;
