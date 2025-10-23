import express from 'express';
import * as purchaseRequestController from '../controllers/purchaseRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get('/', authenticate, asyncHandler(purchaseRequestController.getPurchaseRequests));
router.get('/:id', authenticate, asyncHandler(purchaseRequestController.getPurchaseRequestById));
router.post('/', authenticate, asyncHandler(purchaseRequestController.createPurchaseRequest));
router.patch('/:id', authenticate, asyncHandler(purchaseRequestController.updatePurchaseRequest));

router.get("/:requestId/attachments", asyncHandler(purchaseRequestController.getAttachments));
router.post("/:requestId/attachments/:module", authenticate, upload.single("file"), asyncHandler(purchaseRequestController.uploadAttachment));
router.delete("/attachments/:id", authenticate, asyncHandler(purchaseRequestController.deleteAttachment));

router.post('/:id/select-vendor', authenticate, asyncHandler(purchaseRequestController.selectVendor));
router.post('/:id/po-item/:poItemId/acquire', authenticate, asyncHandler(purchaseRequestController.acquirePOItem));

export default router;
