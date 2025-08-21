const express = require('express');
const router = express.Router();
const completionRequestController = require('../controllers/completionRequestController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(completionRequestController.getCompletionRequests));

module.exports = router;
