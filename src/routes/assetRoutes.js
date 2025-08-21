const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const assetUnitsController = require('../controllers/assetUnitController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(assetController.getAssets));
router.get('/:id', authenticate, asyncHandler(assetController.getAssetByID));
router.get('/:id/units', authenticate, asyncHandler(assetUnitsController.getAssetUnitsByAssetID));
router.get('/by-category/:category_id', authenticate, asyncHandler(assetController.getAssetsByCategoryID));
router.post('/:id/units', authenticate, asyncHandler(assetUnitsController.createAssetUnit));
router.post('/', authenticate, asyncHandler(assetController.createAsset));
router.post('/bulk-delete', authenticate, asyncHandler(assetController.deleteAssetsByIDs));
router.patch('/:id', authenticate, asyncHandler(assetController.updateAssetPartial));
router.delete('/:id', authenticate, asyncHandler(assetController.deleteAssetByID));

module.exports = router;
