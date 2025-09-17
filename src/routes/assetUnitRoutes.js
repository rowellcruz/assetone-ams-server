import express from 'express';
import * as assetUnitsController from '../controllers/assetUnitController.js';
import * as requestController from '../controllers/issueReportController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(assetUnitsController.getAssetUnits));
router.get('/:id', authenticate, asyncHandler(assetUnitsController.getAssetUnitByID));
router.get('/by-assets/:asset_id', authenticate, asyncHandler(assetUnitsController.getAssetUnitsByAssetID));
router.post('/', authenticate, asyncHandler(assetUnitsController.createAssetUnit));
router.post('/bulk-delete', authenticate, asyncHandler(assetUnitsController.deleteAssetUnitsByIDs));
router.patch('/:id', authenticate, asyncHandler(assetUnitsController.updateAssetUnitPartial));
router.delete('/:id', authenticate, asyncHandler(assetUnitsController.deleteAssetUnitByID));

export default router;
