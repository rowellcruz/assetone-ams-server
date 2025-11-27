import * as borrowLogModel from "../models/borrowLogModel.js";
import { updateItemUnitPartial } from "./itemUnitService.js";

export async function getBorrowLog(filters = {}) {
  return await borrowLogModel.getBorrowLogs(filters);
}

export async function getBorrowLogById(id) {
  return await borrowLogModel.getBorrowLogById(id);
}

export async function getBorrowLogByItemUnitId(id) {
  return await borrowLogModel.getBorrowLogsByItemUnitId(id);
}

export async function getItemUnitLastBorrowLog(item_unit_id) {
  return await borrowLogModel.getItemUnitLastBorrowLog(item_unit_id);
}

export async function logBorrow(
  item_unit_id,
  borrowed_by,
  lend_by,
  purpose = null,
  due_date
) {
  const lastBorrowLog = await borrowLogModel.getItemUnitLastBorrowLog(
    item_unit_id
  );
  if (lastBorrowLog) {
    throw new Error("This item is already borrowed and not yet returned.");
  }

  const log = await borrowLogModel.logBorrow(
    item_unit_id,
    borrowed_by,
    lend_by,
    purpose,
    due_date
  );

  await updateItemUnitPartial(item_unit_id, { status: "borrowed" });

  return log;
}

export async function logReturn(id, remarks = null) {
  const log = await getBorrowLogById(id);
  if (!log) throw new Error("No active borrow record found for this item.");

  const updatedLog = await borrowLogModel.logReturn(
    id,
    new Date(),
    "returned",
    remarks
  );

  await updateItemUnitPartial(log.item_unit_id, {
    status: "available",
    updated_at: new Date(),
  });

  return updatedLog;
}
