const scheduleTemplateModel = require("../models/scheduleTemplateModel");
const scheduleModel = require("../models/scheduleModel");

async function getAllScheduleTemplates(filters = {}) {
  return await scheduleTemplateModel.getAllScheduleTemplates(filters);
}

async function getScheduleTemplatesByID(id) {
  return await scheduleTemplateModel.getScheduleTemplatesByID(id);
}

async function createScheduleTemplate(scheduleTemplateData) {
  const createdTemplate = await scheduleTemplateModel.createScheduleTemplate(scheduleTemplateData);

  if (scheduleTemplateData.start_date) {
    await scheduleModel.createSchedule(createdTemplate.id, scheduleTemplateData.start_date);
  }

  if(scheduleTemplateData.asset_unit_ids) {
    await scheduleModel.assignAssets(createdTemplate.id, scheduleTemplateData.asset_unit_ids);
  }

  return createdTemplate;
}

async function updateScheduleTemplatesPartial(id, fieldsToUpdate) {
  return await scheduleTemplateModel.updateScheduleTemplatesPartial(id, fieldsToUpdate);
}

async function deleteScheduleTemplateByID(id) {
  return await scheduleTemplateModel.deleteScheduleTemplateByID(id);
}

async function deleteScheduleTemplatesByIDs(ids) {
  return await scheduleTemplateModel.deleteScheduleTemplatesByIDs(id);
}

module.exports = {
  getAllScheduleTemplates,
  getScheduleTemplatesByID,
  createScheduleTemplate,
  updateScheduleTemplatesPartial,
  deleteScheduleTemplateByID,
  deleteScheduleTemplatesByIDs,
};
