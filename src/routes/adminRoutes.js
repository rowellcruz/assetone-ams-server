import express from 'express';
import { 
  resetUserPassword, 
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration 
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/reset-user-password', resetUserPassword);
router.get('/pending-registrations', getPendingRegistrations);
router.post('/approve-registration', approveRegistration);
router.post('/reject-registration', rejectRegistration);

export default router;