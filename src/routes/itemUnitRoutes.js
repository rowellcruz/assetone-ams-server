import express from 'express';
import * as itemUnitsController from '../controllers/itemUnitController.js';
import * as itemDistributionController from '../controllers/itemDistributionController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'itemUnits';

router.get('/', authenticate, itemUnitsController.getItemUnits);
router.get('/:id', authenticate, itemUnitsController.getItemUnitByID);
router.get('/:id/relocation-log', authenticate, itemUnitsController.itemUnitRelocationLog);
router.get('/:id/maintenance-history', authenticate, itemUnitsController.getMaintenanceHistory);
router.get('/relocation/:departmentId', authenticate, itemUnitsController.itemUnitRelocationLog);
router.get('/by-items/:itemId', authenticate, itemUnitsController.getItemUnitsByItemID);

router.post('/', authenticate, asyncHandler(itemUnitsController.createItemUnit, MODULE));
router.post('/assign-location', authenticate, asyncHandler(itemUnitsController.assignLocations));
router.post('/:id/receive', authenticate, asyncHandler(itemDistributionController.markAsReceived, MODULE));
router.post('/:id/relocate', authenticate, asyncHandler(itemUnitsController.relocateItemUnit, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(itemUnitsController.deleteItemUnitsByIDs, MODULE));
router.patch('/:id', authenticate, asyncHandler(itemUnitsController.updateItemUnitPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(itemUnitsController.deleteItemUnitByID, MODULE));

export default router;
