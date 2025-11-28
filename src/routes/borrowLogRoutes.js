import express from 'express';
import * as borrowLogController from '../controllers/borrowLogController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'borrowLog';

router.get('/', authenticate, borrowLogController.getBorrowLogs);
router.get('/:id', authenticate, borrowLogController.getBorrowLogById);
router.get('/:item_unit_id', authenticate, borrowLogController.getBorrowLogByItemUnitId);

router.post('/log-borrow', authenticate, asyncHandler(borrowLogController.logBorrow, MODULE, "BORROW"));
router.post('/:id/log-return', authenticate, asyncHandler(borrowLogController.logReturn, MODULE, "RETURN"));

export default router;
