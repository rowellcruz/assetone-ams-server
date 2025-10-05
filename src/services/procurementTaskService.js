import * as procurementTaskModel from "../models/procurementTaskModel.js";
import * as attachmentModel from "../models/procurementAttachmentModel.js";
import { createAssetUnit } from "../models/assetUnitModel.js";
import procurementFinalizationModel from "../models/procurementFinalizationModel.js";

export async function getAllProcurementTasks(filters = {}) {
  return await procurementTaskModel.getProcurementTasks(filters);
}

export async function getProcurementTaskByID(id) {
  return await procurementTaskModel.getProcurementTaskByID(id);
}

export async function createProcurementTask(procurementTaskData) {
  return await procurementTaskModel.createProcurementTask(procurementTaskData);
}

export async function updateProcurementTaskPartial(id, fieldsToUpdate) {
  return await procurementTaskModel.updateProcurementTaskPartial(
    id,
    fieldsToUpdate
  );
}

export async function deleteProcurementTaskByID(id) {
  return await procurementTaskModel.deleteProcurementTaskByID(id);
}

export async function deleteProcurementTasksByIDs(ids) {
  return await procurementTaskModel.deleteProcurementTasksByIDs(ids);
}

export async function addAttachment(taskId, file, uploadedBy, module) {
  return await attachmentModel.createAttachment(
    taskId,
    file.filename,
    file.originalname,
    file.mimetype,
    uploadedBy,
    module
  );
}

export async function listAttachments(taskId) {
  return await attachmentModel.getAttachmentsByTask(taskId);
}

export async function removeAttachment(id) {
  return await attachmentModel.deleteAttachment(id);
}

export async function finalizeAcquisition(id, acquisitionData, finalizedBy) {
  return await procurementFinalizationModel.finalizeAcquisition(id, acquisitionData, finalizedBy);
}

export async function finalizeAcquisitionAndCreateUnits(taskId, acquisitionData, finalizedBy) {
  const task = await procurementTaskModel.getProcurementTaskByID(taskId);

  const finalization = await finalizeAcquisition(taskId, acquisitionData, finalizedBy);
  for (let i = 0; i < task.quantity; i++) {
    await createAssetUnit({
      asset_id: task.asset_id,
      brand: acquisitionData.brand,
      vendor_id: acquisitionData.vendor_id,
      lifecycle_status: "active",
      operational_status: "available",
      condition: 100,
      unit_tag: null,
      serial_number: null,
      acquisition_cost: acquisitionData.final_cost_per_unit,
      useful_life_years: acquisitionData.useful_life_years,
      depreciation_method: acquisitionData.depreciation_method,
      depreciation_rate: acquisitionData.depreciation_rate,
      acquisition_date: new Date(),
      department_id: null,
      sub_location_id: null,
      assigned_user_id: null,
      is_legacy: false,
      created_by: finalizedBy,
      updated_by: finalizedBy,
    });
  }

  return finalization;
}
