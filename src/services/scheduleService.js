import * as scheduleModel from "../models/scheduleModel.js";
import * as scheduleTemplateModel from "../models/scheduleTemplateModel.js";
import * as scheduleAssetsModel from "../models/scheduleAssetsModel.js";
import * as scheduleTechnicianModel from "../models/scheduleTechnicianModel.js";

export async function getAllSchedules(filters = {}) {
  return await scheduleModel.getAllSchedules(filters);
}

export async function getAllScheduleOccurrencesWithTemplate(filters = {}) {
  const occurrences = await scheduleModel.getAllScheduleOccurrencesWithTemplate(filters);

  const enrichedOccurrences = await Promise.all(
    occurrences.map(async (occurrence) => {
      const assets = occurrence.is_unplanned
        ? []
        : await scheduleAssetsModel.getAssignedAssetsForOccurrence(occurrence.template_id);
      const technicians = await scheduleTechnicianModel.getScheduleTechniciansByOccurenceId(occurrence.id);
      return {
        ...occurrence,
        assigned_assets: assets,
        assigned_technicians: technicians || [],
      };
    })
  );

  return enrichedOccurrences;
}

export async function updateScheduleOccurrencePartial(id, fieldsToUpdate) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  if (occurrence.status === "completed") {
    throw new Error(
      "Schedule is already completed. No further changes are allowed."
    );
  }

  return await scheduleModel.updateScheduleOccurrencePartial(
    id,
    fieldsToUpdate
  );
}

export async function startScheduleOccurrence(id, startedBy) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const startableStatuses = ["pending", "overdue"];
  if (!startableStatuses.includes(occurrence.status)) {
    throw new Error("Only pending or overdue schedules can be started");
  }

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "in_progress",
    started_at: new Date(),
    started_by: startedBy,
  });

  return updated;
}

export async function completeScheduleOccurrence(id, completedBy) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const completableStatuses = ["in_progress"];
  if (!completableStatuses.includes(occurrence.status)) {
    throw new Error("Only in-progress schedules can be completed");
  }

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "completed",
    completed_at: new Date(),
    completed_by: completedBy,
  });

  const template = await scheduleTemplateModel.getScheduleTemplatesByID(occurrence.template_id);
  if (!template) throw new Error("Template not found");

  if (template.type === "PM" && template.status === "active") {
    await generateNextScheduleOccurrence(template.id, occurrence.scheduled_date, template.frequency_value, template.frequency_unit);
  }

  return updated;
}

export async function skipScheduleOccurrence(id, skippedBy, reason) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const skippableStatus = ["pending", "overdue"];
  if (!skippableStatus.includes(occurrence.status)) {
    throw new Error(
      "Schedule cannot be skipped. Only pending and overdue schedules can be skipped."
    );
  }

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "skipped",
    skipped_at: new Date(),
    skipped_by: skippedBy,
    skipped_reason: reason,
    skipped_context: occurrence.status,
  });

  return updated;
}

export async function generateNextScheduleOccurrence(templateId, previousDate, frequency_value, frequency_unit) {
  let nextDate = new Date(previousDate);

  switch (frequency_unit) {
    case "days":
      nextDate.setDate(nextDate.getDate() + frequency_value);
      break;
    case "weeks":
      nextDate.setDate(nextDate.getDate() + 7 * frequency_value);
      break;
    case "months":
      nextDate.setMonth(nextDate.getMonth() + frequency_value);
      break;
    default:
      throw new Error("Unknown frequency unit");
  }

  return await scheduleModel.createSchedule(templateId, nextDate);
}
