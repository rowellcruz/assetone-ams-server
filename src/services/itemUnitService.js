import * as itemUnitModel from "../models/itemUnitModel.js";
import * as itemModel from "../models/itemModel.js";
import * as notificationSender from "../utils/notificationSender.js";
import * as userModel from "../models/userModel.js";
import * as relocationModel from "../models/relocationModel.js";
import * as scheduleModel from "../models/scheduleModel.js";

const CATEGORY_CODES = {
  Furniture: "FUR",
  "Appliances / Electronics": "ELEC",
  "Tools / Equipment": "TOOL",
  "Machinery / Mechanical Assets": "MECH",
  "IT Equipment / Peripherals": "IT",
};

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

  const categoryCode = CATEGORY_CODES[codes.category] || "GEN";

  const batchQty = itemUnitData.batch_quantity || 1;

  for (let i = 0; i < batchQty; i++) {
    const unitTag = await generateUnitTag({
      department_code: codes?.department_code || "GSO",
      category_code: categoryCode,
    });

    const dataToInsert = {
      ...itemUnitData,
      unit_tag: unitTag,
      serial_number: itemUnitData.serial_numbers?.[i] || null,
    };

    await itemUnitModel.createItemUnit(dataToInsert);
  }

  return "Successfully created item unit(s).";
}

export async function assignLocations({ itemIds = [], subLocationId }) {
  const updatedUnits = [];
  for (const itemId of itemIds) {
    const itemUnit = await updateItemUnitPartial(itemId, {
      sub_location_id: subLocationId,
    });
    updatedUnits.push(itemUnit);
  }
  return updatedUnits;
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
  const itemUnit = await itemUnitModel.updateItemUnitPartial(
    id,
    fieldsToUpdate
  );

  if (fieldsToUpdate.owner_department_id != null) {
    const propertyCustodians =
      await userModel.getPropertyCustodianFromDepartment(
        fieldsToUpdate.owner_department_id
      );

    const recipientIds = propertyCustodians.map((custodian) => custodian.id);

    await notificationSender.sendNotification(
      "item-unit",
      "Item was transferred to your department",
      recipientIds
    );
  }

  return itemUnit;
}

export async function deleteItemUnitByID(id) {
  return await itemUnitModel.deleteItemUnitByID(id);
}

export async function deleteItemUnitsByIDs(ids) {
  return await itemUnitModel.deleteItemUnitsByIDs(ids);
}

export async function relocateItemUnit(id, user, data) {
  const { from_sub_location_id, to_sub_location_id } = data;

  return await relocationModel.logRelocation(
    id,
    from_sub_location_id,
    to_sub_location_id,
    user.id,
  );
}

export async function itemUnitRelocationLog(id) {
  return await relocationModel.getRelocationLogsById(id);
}

export async function getMaintenanceHistory(id) {
  return await scheduleModel.getItemUnitMaintenanceHistory(id);
}

export async function pendingRelocationLogs(department) {
  return await relocationModel.getPendingRelocationLogs(department);
}
