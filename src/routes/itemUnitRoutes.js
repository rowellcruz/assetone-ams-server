import express from 'express';
import * as itemUnitsController from '../controllers/itemUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();
const MODULE = 'itemUnits';

router.get('/', authenticate, itemUnitsController.getItemUnits);
router.get('/:id', authenticate, itemUnitsController.getItemUnitByID);
router.get('/:id/relocation-log', authenticate, itemUnitsController.itemUnitRelocationLog);
router.get('/:id/transfer-log', authenticate, itemUnitsController.itemUnitTransferLog);
router.get('/:id/maintenance-history', authenticate, itemUnitsController.getMaintenanceHistory);
router.get('/relocation/:departmentId', authenticate, itemUnitsController.itemUnitRelocationLog);
router.get('/by-items/:itemId', authenticate, itemUnitsController.getItemUnitsByItemID);

router.post('/', authenticate, asyncHandler(itemUnitsController.createItemUnit, MODULE));
router.post('/import-file', authenticate, upload.single("file"), asyncHandler(itemUnitsController.importItemUnits, MODULE));
router.post('/assign-location', authenticate, asyncHandler(itemUnitsController.assignLocations, MODULE, "UPDATE"));
router.post('/:id/relocate', authenticate, asyncHandler(itemUnitsController.relocateItemUnit, MODULE, "UPDATE"));
router.post('/:id/transfer', authenticate, asyncHandler(itemUnitsController.transferItemUnit, MODULE, "UPDATE"));
router.post('/bulk-delete', authenticate, asyncHandler(itemUnitsController.deleteItemUnitsByIDs, MODULE));
router.patch('/:id', authenticate, asyncHandler(itemUnitsController.updateItemUnitPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(itemUnitsController.deleteItemUnitByID, MODULE));

export default router;
