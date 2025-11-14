import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'schedules';

router.get('/details', authenticate, asyncHandler(scheduleController.getSchedules));
router.get('/all', authenticate, asyncHandler(scheduleController.getAllSchedulesWithTemplates));

router.get('/:id', authenticate, asyncHandler(scheduleController.getScheduleOccurrencesByTemplateId));
router.get('/:id/assigned-assets', authenticate, asyncHandler(scheduleController.getAssignedAssetsByTemplateId));
router.get('/asset-unit/:assetUnitId', authenticate, asyncHandler(scheduleController.getScheduleOccurrencesByAssetUnitId));

router.post('/:id/start', authenticate, asyncHandler(scheduleController.startScheduleOccurrence, MODULE));
router.post('/:id/asset-unit/:unitId', authenticate, asyncHandler(scheduleController.updateScheduleAssetStatus, MODULE));
router.post('/:id/complete', authenticate, asyncHandler(scheduleController.completeScheduleOccurrence, MODULE));
router.post('/:id/reject', authenticate, asyncHandler(scheduleController.rejectScheduleOccurrence, MODULE));
router.post('/:id/skip', authenticate, asyncHandler(scheduleController.skipScheduleOccurrence, MODULE));

export default router;
