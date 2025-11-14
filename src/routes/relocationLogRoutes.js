import express from 'express';
import * as relocationLogController from '../controllers/relocationLogController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'itemCategories';

router.get('/', authenticate, asyncHandler(relocationLogController.getRelocationLog));
router.get('/:id/technician', authenticate, asyncHandler(relocationLogController.getRelocationLogByTechnicianId));
router.post('/start', authenticate, asyncHandler(relocationLogController.startRelocation));
router.post('/complete', authenticate, asyncHandler(relocationLogController.completeRelocation));

export default router;
