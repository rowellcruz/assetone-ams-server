import express from 'express';
import * as procurementTaskController from '../controllers/procurementTaskController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const MODULE = 'procurementTasks';

router.get('/', authenticate, procurementTaskController.getProcurementTasks);
router.get('/:id', authenticate, procurementTaskController.getProcurementTaskByID);
router.get("/:taskId/attachments", procurementTaskController.getAttachments);

router.post('/', authenticate, asyncHandler(procurementTaskController.createProcurementTask, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(procurementTaskController.deleteProcurementTasksByIDs, MODULE));
router.patch('/:id', authenticate, asyncHandler(procurementTaskController.updateProcurementTaskPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(procurementTaskController.deleteProcurementTaskByID, MODULE));

router.post("/:taskId/attachments/:module", authenticate, upload.single("file"), asyncHandler(procurementTaskController.uploadAttachment, MODULE));
router.delete("/attachments/:id", authenticate, asyncHandler(procurementTaskController.deleteAttachment, MODULE));

router.post('/:id/finalize', authenticate, asyncHandler(procurementTaskController.finalizeAcquisition, MODULE));

export default router;
