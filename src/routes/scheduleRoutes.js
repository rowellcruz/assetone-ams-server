import express from 'express';
import * as scheduleController from '../controllers/scheduleController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/details', authenticate, asyncHandler(scheduleController.getSchedules));
router.get('/:id', authenticate, asyncHandler(scheduleController.getScheduleOccurrencesByTemplateId));
router.get('/full', authenticate, asyncHandler(scheduleController.getScheduleOccurrencesWithTemplate));
router.post('/:id/start', authenticate, asyncHandler(scheduleController.startScheduleOccurrence));
router.post('/:id/complete', authenticate, asyncHandler(scheduleController.completeScheduleOccurrence));
router.post('/:id/skip', authenticate, asyncHandler(scheduleController.skipScheduleOccurrence));

export default router;
