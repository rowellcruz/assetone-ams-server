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
router.post('/backup-data', authenticate, asyncHandler(adminController.backupData, MODULE, "BACKUP"));
router.get('/backup/latest', authenticate, asyncHandler(adminController.getLatestBackup, MODULE, "GET_BACKUP"));
router.get('/backup/all', authenticate, asyncHandler(adminController.getAllBackups, MODULE, "GET_BACKUP"));
router.get('/backup/download/:id', authenticate, asyncHandler(adminController.downloadBackupById, MODULE, "DOWNLOAD_BACKUP"));

export default router;