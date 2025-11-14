import * as scheduleModel from "../models/scheduleModel.js";
import * as scheduleTemplateModel from "../models/scheduleTemplateModel.js";
import * as scheduleAssetsModel from "../models/scheduleAssetsModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as scheduleTechnicianModel from "../models/scheduleTechnicianModel.js";

export async function getAllSchedules(filters = {}) {
  return await scheduleModel.getAllSchedules(filters);
}

export async function getAllSchedulesWithTemplates(filters = {}) {
  const schedules = await scheduleModel.getAllSchedulesWithTemplates(filters);

  const schedulesWithDetails = await Promise.all(
    schedules.map(async (schedule) => {
      const [assigned_technicians, assigned_assets] = await Promise.all([
        scheduleTechnicianModel.getScheduleTechniciansByOccurrenceId(schedule.id),
        scheduleAssetsModel.getAssignedAssetsByTemplateId(schedule.id),
      ]);

      // Check if all assigned assets are completed
      const allAssetsCompleted =
        assigned_assets.length > 0 &&
        assigned_assets.every((a) => a.status === "completed");

      // Override schedule status if applicable
      const finalStatus = allAssetsCompleted ? "completed" : schedule.status;

      return {
        ...schedule,
        status: finalStatus,
        assigned_technicians,
        assigned_assets,
      };
    })
  );

  return schedulesWithDetails;
}


export async function getScheduleOccurrencesByAssetUnitId(assetUnitId) {
  return await scheduleModel.getScheduleOccurrencesByAssetUnitId(assetUnitId);
}

export async function getScheduleByTemplateId(templateId) {
  const occurrences = await scheduleModel.getScheduleOccurrenceByTemplateId(
    templateId
  );

  const occurrencesWithTechnicians = await Promise.all(
    occurrences.map(async (occurrence) => {
      const assigned_technicians =
        await scheduleTechnicianModel.getScheduleTechniciansByOccurrenceId(
          occurrence.id
        );
      return {
        ...occurrence,
        assigned_technicians,
      };
    })
  );

  return occurrencesWithTechnicians;
}

export async function getScheduleUnitsByTechnician(id) {
  return await scheduleAssetsModel.getScheduleUnitsByTechnician(id);
}

export async function getAssignedAssetsByTemplateId(id) {
  return await scheduleAssetsModel.getAssignedAssetsByTemplateId(id);
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

export async function startScheduleOccurrence(id, startedBy, technicians = []) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const itemUnits = await itemUnitModel.getAllItemUnits({
    unitsForMaintenance: true,
  });
  const item_unit_ids = itemUnits.map((unit) => unit.id);

  const startableStatuses = ["pending", "overdue"];
  if (!startableStatuses.includes(occurrence.status)) {
    throw new Error("Only pending or overdue schedules can be started");
  }

  if (item_unit_ids) {
    await scheduleAssetsModel.assignAssets(id, item_unit_ids);
  }

  if (!technicians || technicians.length === 0) {
    throw new Error(
      "At least one technician must be assigned to start a schedule"
    );
  }

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "in_progress",
    started_at: new Date(),
    started_by: startedBy,
  });

  await scheduleTechnicianModel.addTechniciansToOccurrence(id, technicians);

  return updated;
}

export async function rejectScheduleOccurrence(id, scheduleData) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "in_progress",
    reviewed_at: new Date(),
    reviewed_by: scheduleData.rejected_by,
    review_remarks: scheduleData.remarks,
  });

  return updated;
}

export async function updateScheduleAsset(id, unitId) {
  console.log(id, unitId);
  await scheduleAssetsModel.updateScheduleAssetStatus(id, unitId);

  await itemUnitModel.updateItemUnitPartial(unitId, {
    status: "available",
    updated_at: new Date(),
  });

  return "OK";
}

export async function completeScheduleOccurrence(id, completedBy) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const completableStatuses = ["in_completion_request", "in_progress"];
  if (!completableStatuses.includes(occurrence.status)) {
    throw new Error("Only in-progress schedules can be completed");
  }

  const template = await scheduleTemplateModel.getScheduleTemplatesByID(
    occurrence.template_id
  );

  if (!template) throw new Error("Template not found");

  if (template.type === "PM" && template.status === "active") {
    await generateNextScheduleOccurrence(
      template.id,
      occurrence.scheduled_date,
      template.frequency_value,
      template.frequency_unit
    );
  }

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "completed",
    completed_at: new Date(),
    completed_by: completedBy,
  });

  if (template.type === "CM" && template.status === "active") {
    await scheduleTemplateModel.updateScheduleTemplatesPartial(template.id, {
      status: "stopped",
      updated_by: completedBy,
    });
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

  const template = await scheduleTemplateModel.getScheduleTemplatesByID(
    occurrence.template_id
  );

  if (!template) throw new Error("Template not found");

  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "skipped",
    skipped_at: new Date(),
    skipped_by: skippedBy,
    skipped_reason: reason,
  });

  if (template.type === "PM" && template.status === "active") {
    await generateNextScheduleOccurrence(
      template.id,
      occurrence.scheduled_date,
      template.frequency_value,
      template.frequency_unit
    );
  }

  return updated;
}

export async function generateNextScheduleOccurrence(
  templateId,
  previousDate,
  frequency_value,
  frequency_unit
) {
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
