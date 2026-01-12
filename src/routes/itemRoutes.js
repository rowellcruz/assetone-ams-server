import express from 'express';
import * as itemController from '../controllers/itemController.js';
import * as itemUnitsController from '../controllers/itemUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();
const MODULE = 'items';

router.get('/', authenticate, asyncHandler(itemController.getItems));
router.get('/:id', authenticate, asyncHandler(itemController.getItemByID));
router.get('/:itemId/units', authenticate, asyncHandler(itemUnitsController.getItemUnitsByItemID));
router.get('/:id/units/:departmentId', authenticate, asyncHandler(itemUnitsController.getItemUnitsByDepartmentID));
router.post('/stickers', authenticate, asyncHandler(itemController.getUnitStickers, MODULE, "DOWNLOAD"));
router.post('/:id/units', authenticate, asyncHandler(itemUnitsController.createItemUnit, MODULE));
router.post('/', authenticate, asyncHandler(itemController.createItem, MODULE));
router.post('/import-file', authenticate, upload.single("file"), asyncHandler(itemController.importItems, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(itemController.deleteItemsByIDs, MODULE));
router.patch('/:id', authenticate, asyncHandler(itemController.updateItemPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(itemController.deleteItemByID, MODULE));

export default router;
