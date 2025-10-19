import express from 'express';
import * as itemCategoryController from '../controllers/itemCategoryController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, asyncHandler(itemCategoryController.getItemCategories));
router.get('/:id', authenticate, asyncHandler(itemCategoryController.getItemCategoryByID));
router.post('/', authenticate, asyncHandler(itemCategoryController.createItemCategory));
router.post('/bulk-delete', authenticate, asyncHandler(itemCategoryController.deleteItemCategoriesByIDs));
router.patch('/:id', authenticate, asyncHandler(itemCategoryController.updateItemCategoryPartial));
router.delete('/:id', authenticate, asyncHandler(itemCategoryController.deleteItemCategoryByID));

export default router;
