const scheduleTemplateService = require("../services/scheduleTemplateService");

const getScheduleTemplates = async (req, res) => {
  const filters = {
    type: req.query.type,
    // Add more filters if needed
  };

  const scheduleTemplates = await scheduleTemplateService.getAllScheduleTemplates(filters);
  res.json(scheduleTemplates);
};

const getScheduleTemplateByID = async (req, res) => {
  const { id } = req.params;
  const scheduleTemplate = await scheduleTemplateService.getScheduleTemplateByID(id);
  if (!scheduleTemplate) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json(scheduleTemplate);
};

const createScheduleTemplate = async (req, res) => {
  const createdScheduleTemplate = await scheduleTemplateService.createScheduleTemplate(req.body);
  res.status(201).json(createdScheduleTemplate);
};

const updateScheduleTemplatePartial = async (req, res) => {
  const { id } = req.params;
  const updated = await scheduleTemplateService.updateScheduleTemplatePartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json(updated);
};

const deleteScheduleTemplateByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await scheduleTemplateService.deleteScheduleTemplateByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json({ message: "Schedule template deleted successfully" });
};

const deleteScheduleTemplatesByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await scheduleTemplateService.deleteScheduleTemplatesByIDs(ids);
  res.json({ message: "Schedule templates deleted successfully" });
};

module.exports = {
  getScheduleTemplates,
  getScheduleTemplateByID,
  createScheduleTemplate,
  updateScheduleTemplatePartial,
  deleteScheduleTemplateByID,
  deleteScheduleTemplatesByIDs,
};
