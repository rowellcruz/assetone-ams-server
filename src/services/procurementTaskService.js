import * as procurementTaskModel from "../models/procurementTaskModel.js";
import * as attachmentModel from "../models/procurementAttachmentModel.js";

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

export async function addAttachment(taskId, file, uploadedBy) {
  return await attachmentModel.createAttachment(
    taskId,
    file.filename,
    file.originalname,
    file.mimetype,
    uploadedBy
  );
}

export async function listAttachments(taskId) {
  return await attachmentModel.getAttachmentsByTask(taskId);
}

export async function removeAttachment(id) {
  return await attachmentModel.deleteAttachment(id);
}
