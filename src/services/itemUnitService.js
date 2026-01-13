import * as itemUnitModel from "../models/itemUnitModel.js";
import * as itemModel from "../models/itemModel.js";
import * as vendorModel from "../models/vendorModel.js";
import * as notificationSender from "../utils/notificationSender.js";
import * as userModel from "../models/userModel.js";
import * as relocationModel from "../models/relocationModel.js";
import * as transferLogModel from "../models/transferLogModel.js";
import * as scheduleModel from "../models/scheduleModel.js";
import * as locationModel from "../models/locationModel.js";
import * as subLocationModel from "../models/subLocationModel.js";
import * as XLSX from "xlsx";

const CATEGORY_CODES = {
  Equipments: "E",
  "Furnitures & Fixtures": "FF",
  "Supplies & Fixtures": "SF",
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

function excelSerialToDate(serial) {
  return new Date((serial - 25569) * 86400 * 1000);
}

export async function importItemUnits(file, user) {
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    cellDates: true,
  });

  const headerRow = rows[0]; // ['Code','Serial Number','Brand','Vendor','Purchase Date(YYYY-MM-DD)','Purchase Cost']
  const dataRows = rows.slice(1);

  const created = [];
  const errors = [];

  for (const row of dataRows) {
    const code = row[0]?.toString().trim();
    const serial_number = row[1]?.toString().trim() || null;
    const brand = row[2]?.toString().trim() || null;
    const vendorName = row[3]?.toString().trim() || null;
    const purchase_date =
      typeof row[4] === "number" ? excelSerialToDate(row[4]) : new Date(row[4]);
    const purchase_cost = row[5] ? parseFloat(row[5]) : null;
    const locationStr = row[6]?.toString().trim() || null;

    if (!code) continue;

    try {
      const item = await itemModel.getItemByCode(code);
      if (!item) throw new Error(`Item code "${code}" not found`);

      let vendor_id = null;
      if (vendorName) {
        const existingVendor = await vendorModel.getAllVendors({
          name: vendorName,
        });
        if (existingVendor.length > 0) {
          vendor_id = existingVendor[0].id;
        } else {
          const createdVendor = await vendorModel.createVendor({
            name: vendorName,
          });
          vendor_id = createdVendor.id;
        }
      }

      let sub_location_id = null;
      if (locationStr) {
        const [locName, subLocName] = locationStr.split("-").map((s) => s.trim());

        // Handle location
        let location = await locationModel.getLocationByName(
          locName.toLowerCase()
        );
        if (!location) {
          location = await locationModel.createLocation({ name: locName, created_by: user.id, updated_by: user.id });
        }
        const location_id = location.id;

        // Handle sub-location
        if (subLocName) {
          let subLocation = await subLocationModel.getSubLocationByName(
            subLocName.toLowerCase(),
            location_id
          );
          if (!subLocation) {
            subLocation = await subLocationModel.createSubLocation({
              name: subLocName,
              location_id,
            });
          }
          sub_location_id = subLocation.id;
        }
      }

      const categoryCode = CATEGORY_CODES[item.category] || "E";
      const unit_tag = await generateUnitTag({
        department_code: item.department_code || "GSO",
        category_code: categoryCode,
      });

      const itemUnitData = {
        item_id: item.id,
        brand,
        unit_tag,
        serial_number,
        purchase_date,
        purchase_cost,
        vendor_id,
        sub_location_id,
        created_by: user.id,
        updated_by: user.id,
      };

      const createdUnit = await createItemUnit(itemUnitData);
      created.push(createdUnit);
    } catch (e) {
      errors.push({ code, serial_number, error: e.message });
    }
  }

  return {
    createdCount: created.length,
    errorCount: errors.length,
    errors,
  };
}

export async function createItemUnit(itemUnitData) {
  let resolvedVendorId = itemUnitData.vendor_id || null;

  if (itemUnitData.new_vendor) {
    const vendorName = itemUnitData.new_vendor.trim();

    const existingVendor = await vendorModel.getAllVendors({
      name: vendorName,
    });

    if (existingVendor.length > 0) {
      resolvedVendorId = existingVendor[0].id;
    } else {
      const createdVendor = await vendorModel.createVendor({
        name: vendorName,
      });

      resolvedVendorId = createdVendor.id;
    }
  }

  const codes = await itemModel.getItemByID(itemUnitData.item_id);
  if (!codes) throw new Error("Invalid item ID");

  const categoryCode = CATEGORY_CODES[codes.category] || "E";
  const batchQty = itemUnitData.batch_quantity || 1;

  for (let i = 0; i < batchQty; i++) {
    const unitTag = await generateUnitTag({
      department_code: codes.department_code || "GSO",
      category_code: categoryCode,
    });

    const dataToInsert = {
      ...itemUnitData,
      vendor_id: resolvedVendorId,
      new_vendor: null,
      unit_tag: unitTag,
      serial_number:
        itemUnitData.serial_numbers?.[i] ?? itemUnitData.serial_number ?? null,
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
    user.id
  );
}

export async function transferItemUnit(id, user, data) {
  const { from_department_id, to_department_id } = data;

  return await transferLogModel.logTransfer(
    id,
    from_department_id,
    to_department_id,
    user.id
  );
}

export async function itemUnitRelocationLog(id) {
  return await relocationModel.getRelocationLogsById(id);
}

export async function itemUnitTransferLog(id) {
  return await transferLogModel.getTransferLogsById(id);
}

export async function getMaintenanceHistory(id) {
  return await scheduleModel.getItemUnitMaintenanceHistory(id);
}

export async function pendingRelocationLogs(department) {
  return await relocationModel.getPendingRelocationLogs(department);
}
