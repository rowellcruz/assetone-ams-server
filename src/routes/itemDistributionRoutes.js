import express from 'express';
import * as itemDistributionController from '../controllers/itemDistributionController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(itemDistributionController.getAllItemsForDistribution));

export default router;
