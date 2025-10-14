import * as assetUnitModel from "../models/assetUnitModel.js";
import * as assetModel from "../models/assetModel.js";

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

export async function getAssetUnitsByDepartmentID(assetId, departmentId) {
  return await assetUnitModel.getAllAssetUnits({ assetId, departmentId });
}

export async function createAssetUnit(assetUnitData) {
  const codes = await assetModel.getAssetByID(assetUnitData.asset_id);
  const unitTag = await generateUnitTag({department_code: codes.department_code, category_code: codes.category_code});
  const dataToInsert = { ...assetUnitData, unit_tag: unitTag };
  return await assetUnitModel.createAssetUnit(dataToInsert);
}

async function generateUnitTag({ department_code, category_code }) {
  const prefix = `${department_code.toUpperCase()}-${category_code.toUpperCase()}`;
  
  const lastUnit = await assetUnitModel.getLastUnitTag(prefix);

  let nextNumber = 1;
  if (lastUnit) {
    const match = lastUnit.unit_tag.match(/(\d+)$/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  const formattedNum = String(nextNumber).padStart(4, "0");
  return `${prefix}-${formattedNum}`;
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
