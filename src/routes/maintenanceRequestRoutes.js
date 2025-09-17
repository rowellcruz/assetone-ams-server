import express from 'express';
import * as maintenanceRequestController from '../controllers/maintenanceRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(maintenanceRequestController.getMaintenanceRequests));

export default router;
