import * as assetCategoryModel from "../models/assetCategoryModel.js";

export async function getAllAssetCategories(filters = {}) {
  return await assetCategoryModel.getAllAssetCategories(filters);
}

export async function getAssetCategoryByID(id) {
  return await assetCategoryModel.getAssetCategoryByID(id);
}

export async function createAssetCategory(assetCategoryData) {
  return await assetCategoryModel.createAssetCategory(assetCategoryData);
}

export async function deleteAssetCategoriesByIDs(ids) {
  return await assetCategoryModel.deleteAssetCategoriesByIDs(ids);
}

export async function updateFullAssetCategory(id, assetCategoryData) {
  return await assetCategoryModel.updateFullAssetCategory(id, assetCategoryData);
}

export async function updateAssetCategoryPartial(id, fieldsToUpdate) {
  return await assetCategoryModel.updateAssetCategoryPartial(id, fieldsToUpdate);
}

export async function deleteAssetCategoryByID(id) {
  return await assetCategoryModel.deleteAssetCategoryByID(id);
}
