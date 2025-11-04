import express from 'express';
import * as purchaseRequestController from '../controllers/purchaseRequestController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const MODULE = 'purchaseRequests';

// Purchase request main endpoints
router.get('/', authenticate, asyncHandler(purchaseRequestController.getPurchaseRequests));
router.get('/:id', authenticate, asyncHandler(purchaseRequestController.getPurchaseRequestById));
router.get('/:id/prf-pdf', authenticate, asyncHandler(purchaseRequestController.getPurchaseRequestPDFById));
router.get('/:id/items-for-distribution', authenticate, asyncHandler(purchaseRequestController.getItemForDistributionByPRId));
router.post('/', authenticate, asyncHandler(purchaseRequestController.createPurchaseRequest));
router.patch('/:id', authenticate, asyncHandler(purchaseRequestController.updatePurchaseRequest));
router.patch('/:id/receive-purchase-orders', authenticate, asyncHandler(purchaseRequestController.updatePurchaseOrderByPRId));

// Attachments
router.get("/:requestId/attachments", asyncHandler(purchaseRequestController.getAttachments)); // optional: no logging
router.post("/:requestId/attachments/:module", authenticate, upload.single("file"), asyncHandler(purchaseRequestController.uploadAttachment, MODULE));
router.delete("/attachments/:id", authenticate, asyncHandler(purchaseRequestController.deleteAttachment, MODULE));

// Vendor / PO actions
router.post('/:id/select-vendor', authenticate, asyncHandler(purchaseRequestController.selectVendor, MODULE));
router.post('/:id/po-item/:poItemId/acquire', authenticate, asyncHandler(purchaseRequestController.acquirePOItem, MODULE));

export default router;
