import express from 'express';
import * as departmentController from '../controllers/departmentController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'departments';

router.get('/', authenticate, departmentController.getDepartments);
router.get('/:id', authenticate, departmentController.getDepartmentByID);
router.get('/:id/technicians', authenticate, departmentController.getAvailableTechnicians);
router.get('/:id/item-units', authenticate, departmentController.getItemUnitsByDepartmentId);
router.get('/:id/assets/report', authenticate, departmentController.downloadDepartmentAssetsReport);

router.post('/', authenticate, asyncHandler(departmentController.createDepartment, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(departmentController.deleteDepartmentsByIDs, MODULE));
router.put('/:id', authenticate, asyncHandler(departmentController.replaceDepartment, MODULE));
router.patch('/:id', authenticate, asyncHandler(departmentController.updateDepartmentPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(departmentController.deleteDepartmentByID, MODULE));

export default router;
