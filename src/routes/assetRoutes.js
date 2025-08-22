import express from 'express';
import * as assetController from '../controllers/assetController.js';
import * as assetUnitsController from '../controllers/assetUnitController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(assetController.getAssets));
router.get('/:id', authenticate, asyncHandler(assetController.getAssetByID));
router.get('/:id/units', authenticate, asyncHandler(assetUnitsController.getAssetUnitsByAssetID));
router.get('/by-category/:category_id', authenticate, asyncHandler(assetController.getAssetsByCategoryID));
router.post('/:id/units', authenticate, asyncHandler(assetUnitsController.createAssetUnit));
router.post('/', authenticate, asyncHandler(assetController.createAsset));
router.post('/bulk-delete', authenticate, asyncHandler(assetController.deleteAssetsByIDs));
router.patch('/:id', authenticate, asyncHandler(assetController.updateAssetPartial));
router.delete('/:id', authenticate, asyncHandler(assetController.deleteAssetByID));

export default router;
