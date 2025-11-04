import express from 'express';
import * as maintenanceRequestController from '../controllers/maintenanceRequestController.js';
import * as itemUnitController from '../controllers/itemUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(maintenanceRequestController.getMaintenanceRequests));
router.get('/:id', authenticate, asyncHandler(maintenanceRequestController.getMaintenanceRequestsByItemUnitId));
router.get('/:id/reported-asset', asyncHandler(itemUnitController.getReportedItemDataById));
router.post('/', asyncHandler(maintenanceRequestController.createRequest));
router.post('/update', authenticate, asyncHandler(maintenanceRequestController.handleReportApproval));

export default router;
