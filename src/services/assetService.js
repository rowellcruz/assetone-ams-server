import * as assetModel from "../models/assetModel.js";

export async function getAllAssets(filters = {}) {
  return await assetModel.getAllAssets(filters);
}

export async function getPublicAssets() {
  return await assetModel.getPublicAssets();
}

export async function getAssetByID(id) {
  return await assetModel.getAssetByID(id);
}

export async function getAssetsByCategoryID(categoryId) {
  return await assetModel.getAllAssets({ categoryId });
}

export async function createAsset(assetData) {
  return await assetModel.createAsset(assetData);
}

export async function updateAssetPartial(id, fieldsToUpdate) {
  return await assetModel.updateAssetPartial(id, fieldsToUpdate);
}

export async function deleteAssetByID(id) {
  return await assetModel.deleteAssetByID(id);
}

export async function deleteAssetsByIDs(ids) {
  return await assetModel.deleteAssetsByIDs(ids);
}
