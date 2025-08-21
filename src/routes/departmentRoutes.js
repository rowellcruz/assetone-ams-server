const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(departmentController.getDepartments));
router.get('/:id', authenticate, asyncHandler(departmentController.getDepartmentByID));
router.post('/', authenticate, asyncHandler(departmentController.createDepartment));
router.post('/bulk-delete', authenticate, asyncHandler(departmentController.deleteDepartmentsByIDs));
router.put('/:id', authenticate, asyncHandler(departmentController.replaceDepartment));
router.patch('/:id', authenticate, asyncHandler(departmentController.updateDepartmentPartial));
router.delete('/:id', authenticate, asyncHandler(departmentController.deleteDepartmentByID));


module.exports = router;