import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authenticate from '../middlewares/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();
const MODULE = 'admin';

router.get('/pending-registrations', adminController.getPendingRegistrations);
router.get('/activity-log', authenticate, adminController.getActivityLog);
router.get('/activity-log/:id', authenticate, adminController.getActivityLogById);
router.get('/pending-registrations/:id', adminController.getPendingRegistrationById);
router.post('/approve-registration', asyncHandler(adminController.approveRegistration, MODULE, "APPROVE"));
router.post('/reject-registration', asyncHandler(adminController.rejectRegistration, MODULE, "REJECT"));

export default router;