import * as relocationLogService from "../services/relocationLogService.js";

export const getRelocationLog = async (req, res) => {
  const filters = {};
  if (req.query.departmentId) filters.departmentId = req.query.departmentId;
  const log = await relocationLogService.getRelocationLog(filters);
  res.status(201).json(log);
};

export const getRelocationLogByTechnicianId = async (req, res) => {
  const { id } = req.params;
  const log = await relocationLogService.getRelocationLogByTechnicianId(id);
  res.status(200).json(log);
};

export const startRelocation = async (req, res) => {
  const { logId, technicianIds } = req.body;
  const log = await relocationLogService.startRelocation(logId, technicianIds);
  res.status(200).json(log);
};

export const completeRelocation = async (req, res) => {
  const { relocation_log_id, item_unit_id } = req.body;
  const log = await relocationLogService.completeRelocation(relocation_log_id, item_unit_id);
  res.status(200).json(log);
};