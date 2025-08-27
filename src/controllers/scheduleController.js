import * as scheduleService from "../services/scheduleService.js";

export const getSchedules = async (req, res) => {
  const filters = {
    status: req.query.status,
  };

  const schedules = await scheduleService.getAllSchedules(filters);
  res.json(schedules);
};

export const getScheduleOccurrencesByTemplateId = async (req, res) => {
  const { id } = req.params;

  const schedules = await scheduleService.getScheduleByTemplateId(id);
  res.json(schedules);
};

export const getAssignedAssetsByTemplateId = async (req, res) => {
  const { id } = req.params;

  const assets = await scheduleService.getAssignedAssetsByTemplateId(id);
  res.json(assets);
};

export const startScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { started_by, technicians } = req.body;

  const updated = await scheduleService.startScheduleOccurrence(
    id,
    started_by,
    technicians
  );

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const completeScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { completed_by } = req.body;

  const updated = await scheduleService.completeScheduleOccurrence(id, completed_by);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const rejectScheduleOccurrence = async (req, res) => {
  const { id } = req.params;

  const updated = await scheduleService.rejectScheduleOccurrence(id);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const skipScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { skipped_by, reason } = req.body;

  const updated = await scheduleService.skipScheduleOccurrence(id, skipped_by, reason);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};
