const scheduleService = require("../services/scheduleService");

const getSchedules = async (req, res) => {
  const filters = {
    status: req.query.status,
    // Add more filters if needed
  };

  const schedules = await scheduleService.getAllSchedules(filters);
  res.json(schedules);
};

const getScheduleOccurrencesWithTemplate = async (req, res) => {
  const filters = {
    status: req.query.status,
    // Add more filters if needed
  };

  const schedules = await scheduleService.getAllScheduleOccurrencesWithTemplate(filters);
  res.json(schedules);
};

const startScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { started_by } = req.body;

  const updated = await scheduleService.startScheduleOccurrence(id, started_by);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

const completeScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { completed_by } = req.body;

  const updated = await scheduleService.completeScheduleOccurrence(id, completed_by);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

const skipScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { skipped_by, reason } = req.body;

  const updated = await scheduleService.skipScheduleOccurrence(id, skipped_by, reason);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};


module.exports = {
  getSchedules,
  getScheduleOccurrencesWithTemplate,
  startScheduleOccurrence,
  completeScheduleOccurrence,
  skipScheduleOccurrence,
};
