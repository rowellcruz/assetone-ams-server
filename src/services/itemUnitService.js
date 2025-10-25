import * as itemUnitModel from "../models/itemUnitModel.js";
import * as itemModel from "../models/itemModel.js";
import * as itemDepreciationModel from "../models/itemDepreciationModel.js";
import * as itemCostModel from "../models/itemCostModel.js";

export async function getAllItemUnits(filters = {}) {
  return await itemUnitModel.getAllItemUnits(filters);
}

export async function getItemUnitByID(id) {
  return await itemUnitModel.getItemUnitByID(id);
}

export async function getReportedItemDataById(id) {
  return await itemUnitModel.getReportedItemDataById(id);
}

export async function getItemUnitsByItemID(itemId) {
  return await itemUnitModel.getAllItemUnits({ itemId });
}

export async function getItemUnitsByDepartmentID(itemId, departmentId) {
  return await itemUnitModel.getAllItemUnits({ itemId, departmentId });
}

export async function createItemUnit(itemUnitData) {
  const codes = await itemModel.getItemByID(itemUnitData.item_id);
  const unitTag = await generateUnitTag({
    department_code: codes?.department_code || "GSO",
    category_code: codes.category_code,
  });

  const dataToInsert = { ...itemUnitData, unit_tag: unitTag };

  const unitData = await itemUnitModel.createItemUnit(dataToInsert);

  await itemDepreciationModel.createItemDepreciation({
    ...itemUnitData,
    item_unit_id: unitData.id,
  });

  await itemCostModel.createItemCost({
    ...itemUnitData,
    item_unit_id: unitData.id,
  });

  return unitData;
}

async function generateUnitTag({ department_code, category_code }) {
  const prefix = `${department_code.toUpperCase()}-${category_code.toUpperCase()}`;
  
  const lastUnit = await itemUnitModel.getLastUnitTag(prefix);

  let nextNumber = 1;
  if (lastUnit) {
    const match = lastUnit.unit_tag.match(/(\d+)$/);
    if (match) nextNumber = parseInt(match[1]) + 1;
  }

  const formattedNum = String(nextNumber).padStart(4, "0");
  return `${prefix}-${formattedNum}`;
}

export async function updateItemUnitPartial(id, fieldsToUpdate) {
  return await itemUnitModel.updateItemUnitPartial(id, fieldsToUpdate);
}

export async function deleteItemUnitByID(id) {
  return await itemUnitModel.deleteItemUnitByID(id);
}

export async function deleteItemUnitsByIDs(ids) {
  return await itemUnitModel.deleteItemUnitsByIDs(ids);
}
