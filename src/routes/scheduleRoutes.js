const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/details', authenticate, asyncHandler(scheduleController.getSchedules));
router.get('/full', authenticate, asyncHandler(scheduleController.getScheduleOccurrencesWithTemplate));
router.post('/:id/start', authenticate, asyncHandler(scheduleController.startScheduleOccurrence));
router.post('/:id/complete', authenticate, asyncHandler(scheduleController.completeScheduleOccurrence));
router.post('/:id/skip', authenticate, asyncHandler(scheduleController.skipScheduleOccurrence));

module.exports = router;
