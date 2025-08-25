import * as scheduleTemplateModel from "../models/scheduleTemplateModel.js";
import * as scheduleModel from "../models/scheduleModel.js";
import * as scheduleAssetsModel from "../models/scheduleAssetsModel.js";

export async function getAllScheduleTemplates(filters = {}) {
  return await scheduleTemplateModel.getAllScheduleTemplates(filters);
}

export async function getScheduleTemplatesByID(id) {
  return await scheduleTemplateModel.getScheduleTemplatesByID(id);
}

export async function createScheduleTemplate(scheduleTemplateData) {
  const createdTemplate = await scheduleTemplateModel.createScheduleTemplate(scheduleTemplateData);

  if (scheduleTemplateData.start_date) {
    await scheduleModel.createSchedule(createdTemplate.id, scheduleTemplateData.start_date);
  }

  if (scheduleTemplateData.asset_unit_ids) {
    await scheduleAssetsModel.assignAssets(createdTemplate.id, scheduleTemplateData.asset_unit_ids);
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
