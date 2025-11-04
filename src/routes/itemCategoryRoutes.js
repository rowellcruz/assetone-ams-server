import express from 'express';
import * as itemCategoryController from '../controllers/itemCategoryController.js';
import asyncHandler from '../utils/asyncHandler.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();
const MODULE = 'itemCategories';

router.get('/', authenticate, itemCategoryController.getItemCategories);
router.get('/:id', authenticate, itemCategoryController.getItemCategoryByID);

router.post('/', authenticate, asyncHandler(itemCategoryController.createItemCategory, MODULE));
router.post('/bulk-delete', authenticate, asyncHandler(itemCategoryController.deleteItemCategoriesByIDs, MODULE));
router.patch('/:id', authenticate, asyncHandler(itemCategoryController.updateItemCategoryPartial, MODULE));
router.delete('/:id', authenticate, asyncHandler(itemCategoryController.deleteItemCategoryByID, MODULE));

export default router;
