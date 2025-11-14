import * as relocationLogModel from "../models/relocationLogModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";

export async function getRelocationLog(filters = {}) {
  return await relocationLogModel.getRelocationLog(filters);
}

export async function getRelocationLogByTechnicianId(id) {
  return await relocationLogModel.getRelocationLogByTechnicianId(id);
}

export async function startRelocation(logId, technicianIds = []) {
  const log = await relocationLogModel.getRelocationLogByID(logId);

  for (const techId of technicianIds) {
    await relocationLogModel.assignRelocationTask(logId, techId);
  }

  await relocationLogModel.updateRelocationLog(logId, {
    status: "in_progress",
  });

  await itemUnitModel.updateItemUnitPartial(log?.item_unit_id, {
    status: "under_relocation",
    updated_at: new Date(),
  });

  return log;
}

export async function completeRelocation(logId, itemUnitId) {
  await relocationLogModel.updateRelocationLog(logId, {
    status: "completed",
    completed_at: new Date(),
  });

  await itemUnitModel.updateItemUnitPartial(itemUnitId, {
    status: "available",
    updated_at: new Date(),
  });

  const log = await relocationLogModel.getRelocationLogByID(logId);
  return log;
}
