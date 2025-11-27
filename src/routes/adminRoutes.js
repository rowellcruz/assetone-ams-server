import express from 'express';
import { 
  getPendingRegistrations,
  approveRegistration,
  rejectRegistration, 
  getPendingRegistrationById
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/pending-registrations', getPendingRegistrations);
router.get('/pending-registrations/:id', getPendingRegistrationById);
router.post('/approve-registration', approveRegistration);
router.post('/reject-registration', rejectRegistration);

export default router;