import express from 'express';
import * as departmentController from '../controllers/departmentController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(departmentController.getDepartments));
router.get('/:id', authenticate, asyncHandler(departmentController.getDepartmentByID));
router.get('/:id/requests', authenticate, asyncHandler(departmentController.getPurchaseRequests));
router.post('/', authenticate, asyncHandler(departmentController.createDepartment));
router.post('/:departmentId', authenticate, asyncHandler(departmentController.createPurchaseRequest));
router.post('/:id/distribute', authenticate, asyncHandler(departmentController.distributeUnits));
router.post('/bulk-delete', authenticate, asyncHandler(departmentController.deleteDepartmentsByIDs));
router.put('/:id', authenticate, asyncHandler(departmentController.replaceDepartment));
router.patch('/:id', authenticate, asyncHandler(departmentController.updateDepartmentPartial));
router.delete('/:id', authenticate, asyncHandler(departmentController.deleteDepartmentByID));

export default router;
