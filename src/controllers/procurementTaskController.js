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
    res.status(404);
    throw new Error("Procurement Task not found");
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
    res.status(404);
    throw new Error("Procurement Task not found");
  }
  res.json(updated);
};

export const deleteProcurementTaskByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await procurementTaskService.deleteProcurementTaskByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Procurement Task not found");
  }
  res.json({ message: "Procurement Task deleted successfully" });
};

export const deleteProcurementTasksByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await procurementTaskService.deleteProcurementTasksByIDs(ids);
  res.json({ message: "Procurement Tasks deleted successfully" });
};

export async function uploadAttachment(req, res, next) {
  try {
    const { taskId } = req.params;
    const uploadedBy = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await procurementTaskService.addAttachment(taskId, file, uploadedBy);
    res.status(201).json(attachment);
  } catch (err) {
    next(err);
  }
}

export async function getAttachments(req, res, next) {
  try {
    const { taskId } = req.params;
    const attachments = await procurementTaskService.listAttachments(taskId);
    res.json(attachments);
  } catch (err) {
    next(err);
  }
}

export async function deleteAttachment(req, res, next) {
  try {
    const { id } = req.params;
    const attachment = await procurementTaskService.removeAttachment(id);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.json({ message: "Attachment deleted", attachment });
  } catch (err) {
    next(err);
  }
}
