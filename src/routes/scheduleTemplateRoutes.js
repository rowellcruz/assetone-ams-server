import express from 'express';
import * as scheduleTemplateController from '../controllers/scheduleTemplateController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplates));
router.get('/id/:id', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplateByID));
router.get('/asset/:assetId', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplatesByAssetID));
router.post('/', authenticate, asyncHandler(scheduleTemplateController.createScheduleTemplate));
router.post('/bulk-delete', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplatesByIDs));
router.patch('/:id', authenticate, asyncHandler(scheduleTemplateController.updateScheduleTemplatePartial));
router.delete('/:id', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplateByID));

export default router;
