const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const asyncHandler = require('../utils/asyncHandler');

router.get('/', authenticate, asyncHandler(userController.getUsers));
router.get('/me', authenticate, asyncHandler(userController.getMe));
router.get('/:id', authenticate, asyncHandler(userController.getUserByID));
router.post('/', authenticate, asyncHandler(userController.createUser));
router.post('/bulk-delete', authenticate, asyncHandler(userController.deleteUsersByIDs));
router.put('/:id', authenticate, asyncHandler(userController.replaceUser));
router.patch('/:id', authenticate, asyncHandler(userController.updateUserPartial));
router.delete('/:id', authenticate, asyncHandler(userController.deleteUserByID));

module.exports = router;