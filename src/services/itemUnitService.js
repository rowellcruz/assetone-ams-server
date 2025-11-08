import * as itemUnitModel from "../models/itemUnitModel.js";
import * as itemModel from "../models/itemModel.js";
import * as itemDepreciationModel from "../models/itemDepreciationModel.js";
import * as itemCostModel from "../models/itemCostModel.js";
import * as relocationModel from "../models/relocationModel.js";

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

  const createdUnits = [];

  const batchQty = itemUnitData.batch_quantity || 1;

  for (let i = 0; i < batchQty; i++) {
    const unitTag = await generateUnitTag({
      department_code: codes?.department_code || "GSO",
      category_code: codes.category_code,
    });

    const dataToInsert = {
      ...itemUnitData,
      unit_tag: unitTag,
      serial_number: itemUnitData.serial_numbers?.[i] || null,
    };

    const unitData = await itemUnitModel.createItemUnit(dataToInsert);

    await itemDepreciationModel.createItemDepreciation({
      ...itemUnitData,
      item_unit_id: unitData.id,
    });

    await itemCostModel.createItemCost({
      ...itemUnitData,
      item_unit_id: unitData.id,
    });

    createdUnits.push(unitData);
  }

  return createdUnits;
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

export async function relocateItemUnit(id, user, data) {
  const { from_sub_location_id, to_sub_location_id, requested_from } = data;
  return await relocationModel.logRelocation(
    id,
    from_sub_location_id,
    to_sub_location_id,
    user.id,
    requested_from
  );
}

export async function itemUnitRelocationLog(id) {
  return await relocationModel.getRelocationLogsById(id);
}

export async function pendingRelocationLogs(department) {
  return await relocationModel.getPendingRelocationLogs(department);
}
