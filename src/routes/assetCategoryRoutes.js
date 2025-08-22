import express from 'express';
import * as assetCategoryController from '../controllers/assetCategoryController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(assetCategoryController.getAssetCategories));
router.get('/:id', authenticate, asyncHandler(assetCategoryController.getAssetCategoryByID));
router.post('/', authenticate, asyncHandler(assetCategoryController.createAssetCategory));
router.post('/bulk-delete', authenticate, asyncHandler(assetCategoryController.deleteAssetCategoriesByIDs));
router.put('/:id', authenticate, asyncHandler(assetCategoryController.replaceAssetCategory));
router.patch('/:id', authenticate, asyncHandler(assetCategoryController.updateAssetCategoryPartial));
router.delete('/:id', authenticate, asyncHandler(assetCategoryController.deleteAssetCategoryByID));

export default router;
