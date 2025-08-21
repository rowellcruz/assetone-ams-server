const express = require('express');
const router = express.Router();
const scheduleTemplateController = require('../controllers/scheduleTemplateController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplates));
router.get('/:id', authenticate, asyncHandler(scheduleTemplateController.getScheduleTemplateByID));
router.post('/', authenticate, asyncHandler(scheduleTemplateController.createScheduleTemplate));
router.post('/bulk-delete', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplateByID));
router.patch('/:id', authenticate, asyncHandler(scheduleTemplateController.updateScheduleTemplatePartial));
router.delete('/:id', authenticate, asyncHandler(scheduleTemplateController.deleteScheduleTemplatesByIDs));

module.exports = router;
