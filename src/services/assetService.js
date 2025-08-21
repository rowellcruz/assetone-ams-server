const assetModel = require("../models/assetModel");

async function getAllAssets(filters = {}) {
  return await assetModel.getAllAssets(filters);
}

async function getAssetByID(id) {
  return await assetModel.getAssetByID(id);
}

async function getAssetsByCategoryID(categoryId) {
  return await assetModel.getAllAssets({ categoryId });
}

async function createAsset(assetData) {
  return await assetModel.createAsset(assetData);
}

async function updateAssetPartial(id, fieldsToUpdate) {
  return await assetModel.updateAssetPartial(id, fieldsToUpdate);
}

async function deleteAssetByID(id) {
  return await assetModel.deleteAssetByID(id);
}

async function deleteAssetsByIDs(ids) {
  return await assetModel.deleteAssetsByIDs(ids);
}

module.exports = {
  getAllAssets,
  getAssetByID,
  getAssetsByCategoryID,
  createAsset,
  updateAssetPartial,
  deleteAssetByID,
  deleteAssetsByIDs,
};
