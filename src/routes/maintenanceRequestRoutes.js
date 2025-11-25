import express from 'express';
import * as maintenanceRequestController from '../controllers/maintenanceRequestController.js';
import * as itemUnitController from '../controllers/itemUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(maintenanceRequestController.getMaintenanceRequests));
router.get('/:id/reported-asset', asyncHandler(itemUnitController.getReportedItemDataById));
router.get('/:id/:status', authenticate, asyncHandler(maintenanceRequestController.getMaintenanceRequestsByItemUnitId));
router.post('/', asyncHandler(maintenanceRequestController.createRequest));
router.post('/update', authenticate, asyncHandler(maintenanceRequestController.handleReportApproval));

export default router;
