import express from 'express';
import * as itemController from '../controllers/itemController.js';
import * as itemUnitsController from '../controllers/itemUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(itemController.getItems));
router.get('/:id', authenticate, asyncHandler(itemController.getItemByID));
router.get('/:itemId/units', authenticate, asyncHandler(itemUnitsController.getItemUnitsByItemID));
router.get('/:id/units/:departmentId', authenticate, asyncHandler(itemUnitsController.getItemUnitsByDepartmentID));
router.post('/stickers', authenticate, itemController.getUnitStickers);
router.post('/:id/units', authenticate, asyncHandler(itemUnitsController.createItemUnit));
router.post('/', authenticate, asyncHandler(itemController.createItem));
router.post('/bulk-delete', authenticate, asyncHandler(itemController.deleteItemsByIDs));
router.patch('/:id', authenticate, asyncHandler(itemController.updateItemPartial));
router.delete('/:id', authenticate, asyncHandler(itemController.deleteItemByID));

export default router;
