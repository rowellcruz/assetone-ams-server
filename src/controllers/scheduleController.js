import * as scheduleService from "../services/scheduleService.js";

export const getSchedules = async (req, res) => {
  const filters = {
    status: req.query.status,
  };

  const schedules = await scheduleService.getAllSchedules(filters);
  res.json(schedules);
};

export const getScheduleOccurrencesWithTemplate = async (req, res) => {
  const filters = {
    status: req.query.status,
  };

  const schedules = await scheduleService.getAllScheduleOccurrencesWithTemplate(filters);
  res.json(schedules);
};

export const startScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { started_by } = req.body;

  const updated = await scheduleService.startScheduleOccurrence(id, started_by);

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
