import express from 'express';
import * as itemUnitsController from '../controllers/itemUnitController.js';
import * as itemDistributionController from '../controllers/itemDistributionController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(itemUnitsController.getItemUnits));
router.get('/:id', authenticate, asyncHandler(itemUnitsController.getItemUnitByID));
router.get('/by-items/:itemId', authenticate, asyncHandler(itemUnitsController.getItemUnitsByItemID));
router.post('/', authenticate, asyncHandler(itemUnitsController.createItemUnit));
router.post('/:id/receive', authenticate, asyncHandler(itemDistributionController.markAsReceived));
router.post('/bulk-delete', authenticate, asyncHandler(itemUnitsController.deleteItemUnitsByIDs));
router.patch('/:id', authenticate, asyncHandler(itemUnitsController.updateItemUnitPartial));
router.delete('/:id', authenticate, asyncHandler(itemUnitsController.deleteItemUnitByID));

export default router;
