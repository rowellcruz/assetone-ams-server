import express from 'express';
import { resetUserPassword } from '../controllers/adminController.js';

const router = express.Router();

router.post('/reset-user-password', resetUserPassword);

export default router;
