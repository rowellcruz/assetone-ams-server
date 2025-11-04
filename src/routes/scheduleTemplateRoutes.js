import express from 'express';
import * as scheduleTemplateController from '../controllers/scheduleTemplateController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'scheduleTemplates';

router.get('/', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplates));
router.get('/id/:id', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplateByID));
router.get('/asset/:assetId', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplatesByAssetID));

router.post('/', authenticate, asyncHandler(scheduleTemplateController.createScheduleTemplate, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplatesByIDs, MODULE));

router.patch('/:id', authenticate, asyncHandler(scheduleTemplateController.updateScheduleTemplatePartial, MODULE));

router.delete('/:id', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplateByID, MODULE));

export default router;
