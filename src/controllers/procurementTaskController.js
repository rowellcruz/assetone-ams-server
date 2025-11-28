import * as procurementTaskService from "../services/procurementTaskService.js";

export const getProcurementTasks = async (req, res) => {
  const filters = {
    categoryId: req.query.categoryId,
  };

  const procurementTasks = await procurementTaskService.getAllProcurementTasks(filters);
  res.json(procurementTasks);
};

export const getProcurementTaskByID = async (req, res) => {
  const { id } = req.params;
  const procurementTask = await procurementTaskService.getProcurementTaskByID(id);
  if (!procurementTask) {
    return res.status(404).json({ message: "Procurement Task not found" });
  }
  res.json(procurementTask);
};

export const createProcurementTask = async (req, res) => {
  const createdProcurementTask = await procurementTaskService.createProcurementTask(req.body);
  res.status(201).json(createdProcurementTask);
};

export const updateProcurementTaskPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await procurementTaskService.updateProcurementTaskPartial(id, req.body);
  if (!updated) {
    return res.status(404).json({ message: "Procurement Task not found" });
  }
  res.json(updated);
};

export const deleteProcurementTaskByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await procurementTaskService.deleteProcurementTaskByID(id);
  if (!deleted) {
    return res.status(404).json({ message: "Procurement Task not found" });
  }
  res.json({ message: "Procurement Task deleted successfully" });
};

export const deleteProcurementTasksByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "IDs array is required" });
  }
  await procurementTaskService.deleteProcurementTasksByIDs(ids);
  res.json({ message: "Procurement Tasks deleted successfully" });
};

export const uploadAttachment = async (req, res) => {
  const { taskId, module } = req.params;
  const uploadedBy = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const attachment = await procurementTaskService.addAttachment(taskId, file, uploadedBy, module);
  res.status(201).json(attachment);
};

export const getAttachments = async (req, res) => {
  const { taskId } = req.params;
  const attachments = await procurementTaskService.listAttachments(taskId);
  res.json(attachments);
};

export const deleteAttachment = async (req, res) => {
  const { id } = req.params;
  const attachment = await procurementTaskService.removeAttachment(id);

  if (!attachment) {
    return res.status(404).json({ message: "Attachment not found" });
  }

  res.json({ message: "Attachment deleted", attachment });
};

export const finalizeAcquisition = async (req, res) => {
  const { id } = req.params;
  const finalized = await procurementTaskService.finalizeAcquisitionAndCreateUnits(id, req.body, req.user.id);
  if (!finalized) {
    return res.status(404).json({ message: "Procurement Task not found or cannot be finalized" });
  }
  res.json(finalized);
};
