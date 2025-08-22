import express from 'express';
import * as userController from '../controllers/userController.js';
import authenticate from '../middlewares/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(userController.getUsers));
router.get('/me', authenticate, asyncHandler(userController.getMe));
router.get('/:id', authenticate, asyncHandler(userController.getUserByID));
router.post('/', authenticate, asyncHandler(userController.createUser));
router.post('/bulk-delete', authenticate, asyncHandler(userController.deleteUsersByIDs));
router.put('/:id', authenticate, asyncHandler(userController.replaceUser));
router.patch('/:id', authenticate, asyncHandler(userController.updateUserPartial));
router.delete('/:id', authenticate, asyncHandler(userController.deleteUserByID));

export default router;
