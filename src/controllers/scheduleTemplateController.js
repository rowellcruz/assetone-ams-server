import * as scheduleTemplateService from "../services/scheduleTemplateService.js";

export const getScheduleTemplates = async (req, res) => {
  const filters = {
    type: req.query.type,
  };

  const scheduleTemplates = await scheduleTemplateService.getAllScheduleTemplates(filters);
  res.json(scheduleTemplates);
};

export const getScheduleTemplateByID = async (req, res) => {
  const { id } = req.params;
  const scheduleTemplate = await scheduleTemplateService.getScheduleTemplatesByID(id);
  if (!scheduleTemplate) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json(scheduleTemplate);
};

export const getScheduleTemplatesByAssetID = async (req, res) => {
  const { assetId } = req.params;
  const scheduleTemplates = await scheduleTemplateService.getScheduleTemplatesByAssetID(assetId);
  res.json(scheduleTemplates);
}

export const createScheduleTemplate = async (req, res) => {
  const createdScheduleTemplate = await scheduleTemplateService.createScheduleTemplate(req.body);
  res.status(201).json(createdScheduleTemplate);
};

export const updateScheduleTemplatePartial = async (req, res) => {
  const { id } = req.params;
  const updated = await scheduleTemplateService.updateScheduleTemplatePartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json(updated);
};

export const deleteScheduleTemplateByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await scheduleTemplateService.deleteScheduleTemplateByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Schedule template not found");
  }
  res.json({ message: "Schedule template deleted successfully" });
};

export const deleteScheduleTemplatesByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await scheduleTemplateService.deleteScheduleTemplatesByIDs(ids);
  res.json({ message: "Schedule templates deleted successfully" });
};
