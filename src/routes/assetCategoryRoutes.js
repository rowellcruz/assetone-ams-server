const express = require('express');
const router = express.Router();
const assetCategoryController = require('../controllers/assetCategoryController');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, asyncHandler(assetCategoryController.getAssetCategories));
router.get('/:id', authenticate, asyncHandler(assetCategoryController.getAssetCategoryByID));
router.post('/', authenticate, asyncHandler(assetCategoryController.createAssetCategory));
router.post('/bulk-delete', authenticate, asyncHandler(assetCategoryController.deleteAssetCategoriesByIDs));
router.put('/:id', authenticate, asyncHandler(assetCategoryController.replaceAssetCategory));
router.patch('/:id', authenticate, asyncHandler(assetCategoryController.updateAssetCategoryPartial));
router.delete('/:id', authenticate, asyncHandler(assetCategoryController.deleteAssetCategoryByID));

module.exports = router;