import express from 'express';
import { login, requestPasswordReset } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);

export default router;
