const express = require('express');
const router = express.Router();
const assetUnitsController = require('../controllers/assetUnitController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(assetUnitsController.getAssetUnits));
router.get('/:id', authenticate, asyncHandler(assetUnitsController.getAssetUnitByID));
router.get('/by-assets/:asset_id', authenticate, asyncHandler(assetUnitsController.getAssetUnitsByAssetID));
router.post('/', authenticate, asyncHandler(assetUnitsController.createAssetUnit));
router.post('/bulk-delete', authenticate, asyncHandler(assetUnitsController.deleteAssetUnitsByIDs));
router.patch('/:id', authenticate, asyncHandler(assetUnitsController.updateAssetUnitPartial));
router.delete('/:id', authenticate, asyncHandler(assetUnitsController.deleteAssetUnitByID));

module.exports = router;
