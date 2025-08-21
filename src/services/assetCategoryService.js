const assetCategoryModel = require("../models/assetCategoryModel");

async function getAllAssetCategories(filters = {}) {
  return await assetCategoryModel.getAllAssetCategories(filters);
}

async function getAssetCategoryByID(id) {
  return await assetCategoryModel.getAssetCategoryByID(id);
}

async function createAssetCategory(assetCategoryData) {
  return await assetCategoryModel.createAssetCategory(assetCategoryData);
}

async function deleteAssetCategoriesByIDs(ids) {
  return await assetCategoryModel.deleteAssetCategoriesByIDs(ids);
}

async function updateFullAssetCategory(id, assetCategoryData) {
  return await assetCategoryModel.updateFullAssetCategory(id, assetCategoryData);
}

async function updateAssetCategoryPartial(id, fieldsToUpdate) {
  return await assetCategoryModel.updateAssetCategoryPartial(id, fieldsToUpdate);
}

async function deleteAssetCategoryByID(id) {
  return await assetCategoryModel.deleteAssetCategoryByID(id);
}

module.exports = {
  getAllAssetCategories, 
  getAssetCategoryByID,
  createAssetCategory,
  deleteAssetCategoriesByIDs,
  updateFullAssetCategory,
  updateAssetCategoryPartial,
  deleteAssetCategoryByID,
};
