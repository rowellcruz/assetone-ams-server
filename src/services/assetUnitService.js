const assetUnitModel = require("../models/assetUnitModel");

async function getAllAssetUnits(filters = {}) {
  return await assetUnitModel.getAllAssetUnits(filters);
}

async function getAssetUnitByID(id) {
  return await assetUnitModel.getAssetUnitByID(id);
}

async function getAssetUnitsByAssetID(assetId) {
  return await assetUnitModel.getAllAssetUnits({ assetId });
}

async function createAssetUnit(assetUnitData) {
  return await assetUnitModel.createAssetUnit(assetUnitData);
}

async function updateAssetUnitPartial(id, fieldsToUpdate) {
  return await assetUnitModel.updateAssetUnitPartial(id, fieldsToUpdate);
}

async function deleteAssetUnitByID(id) {
  return await assetUnitModel.deleteAssetUnitByID(id);
}

async function deleteAssetUnitsByIDs(ids) {
  return await assetUnitModel.deleteAssetUnitsByIDs(ids);
}

module.exports = {
  getAllAssetUnits,
  getAssetUnitByID,
  getAssetUnitsByAssetID,
  createAssetUnit,
  updateAssetUnitPartial,
  deleteAssetUnitByID,
  deleteAssetUnitsByIDs,
};
