import * as assetUnitModel from "../models/assetUnitModel.js";

export async function getAllAssetUnits(filters = {}) {
  return await assetUnitModel.getAllAssetUnits(filters);
}

export async function getAssetUnitByID(id) {
  return await assetUnitModel.getAssetUnitByID(id);
}

export async function getReportedAssetDataById(id) {
  return await assetUnitModel.getReportedAssetDataById(id);
}

export async function getAssetUnitsByAssetID(assetId) {
  return await assetUnitModel.getAllAssetUnits({ assetId });
}

export async function createAssetUnit(assetUnitData) {
  return await assetUnitModel.createAssetUnit(assetUnitData);
}

export async function updateAssetUnitPartial(id, fieldsToUpdate) {
  return await assetUnitModel.updateAssetUnitPartial(id, fieldsToUpdate);
}

export async function deleteAssetUnitByID(id) {
  return await assetUnitModel.deleteAssetUnitByID(id);
}

export async function deleteAssetUnitsByIDs(ids) {
  return await assetUnitModel.deleteAssetUnitsByIDs(ids);
}
