import express from 'express';
import * as procurementTaskController from '../controllers/procurementTaskController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get('/', authenticate, asyncHandler(procurementTaskController.getProcurementTasks));
router.get('/:id', authenticate, asyncHandler(procurementTaskController.getProcurementTaskByID));
router.post('/', authenticate, asyncHandler(procurementTaskController.createProcurementTask));
router.post('/bulk-delete', authenticate, asyncHandler(procurementTaskController.deleteProcurementTasksByIDs));
router.patch('/:id', authenticate, asyncHandler(procurementTaskController.updateProcurementTaskPartial));
router.delete('/:id', authenticate, asyncHandler(procurementTaskController.deleteProcurementTaskByID));

router.get("/:taskId/attachments", asyncHandler(procurementTaskController.getAttachments));
router.post("/:taskId/attachments", authenticate, upload.single("file"), asyncHandler(procurementTaskController.uploadAttachment));
router.delete("/attachments/:id", authenticate, asyncHandler(procurementTaskController.deleteAttachment));

export default router;
