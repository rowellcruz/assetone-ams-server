import * as scheduleTemplateModel from "../models/scheduleTemplateModel.js";
import * as scheduleModel from "../models/scheduleModel.js";

export async function getAllScheduleTemplates(filters = {}) {
  return await scheduleTemplateModel.getAllScheduleTemplates(filters);
}

export async function getScheduleTemplatesByID(id, filters = {}) {
  return await scheduleTemplateModel.getScheduleTemplatesByID(id, filters);
}

export async function getScheduleTemplatesByAssetID(assetId, filters = {}) {
  return await scheduleTemplateModel.getScheduleTemplatesByAssetID(assetId, filters);
}

export async function createScheduleTemplate(scheduleTemplateData) {
  const createdTemplate = await scheduleTemplateModel.createScheduleTemplate(scheduleTemplateData);

  if (scheduleTemplateData.start_date) {
    await scheduleModel.createSchedule(createdTemplate.id, scheduleTemplateData.start_date);
  }

  return createdTemplate;
}

export async function updateScheduleTemplatesPartial(id, fieldsToUpdate) {
  return await scheduleTemplateModel.updateScheduleTemplatesPartial(id, fieldsToUpdate);
}

export async function deleteScheduleTemplateByID(id) {
  return await scheduleTemplateModel.deleteScheduleTemplateByID(id);
}

export async function deleteScheduleTemplatesByIDs(ids) {
  return await scheduleTemplateModel.deleteScheduleTemplatesByIDs(ids);
}
