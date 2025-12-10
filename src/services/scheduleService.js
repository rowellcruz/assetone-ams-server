import * as scheduleModel from "../models/scheduleModel.js";
import * as scheduleTemplateModel from "../models/scheduleTemplateModel.js";
import * as scheduleAssetsModel from "../models/scheduleAssetsModel.js";
import * as userModel from "../models/userModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as itemModel from "../models/itemModel.js";
import * as scheduleTechnicianModel from "../models/scheduleTechnicianModel.js";
import * as maintenanceRequestModel from "../models/maintenanceRequestModel.js";
import * as mailer from "../utils/mailer.js";

export async function getAllSchedules(filters = {}) {
  return await scheduleModel.getAllSchedules(filters);
}

export async function getAllSchedulesWithTemplates(filters = {}) {
  const schedules = await scheduleModel.getAllSchedulesWithTemplates(filters);

  const schedulesWithDetails = await Promise.all(
    schedules.map(async (schedule) => {
      const [assigned_technicians, assigned_assets] = await Promise.all([
        scheduleTechnicianModel.getScheduleTechniciansByOccurrenceId(
          schedule.id
        ),
        scheduleAssetsModel.getAssignedAssetsByOccurrenceId(schedule.id),
      ]);

      return {
        ...schedule,
        assigned_technicians,
        assigned_assets,
      };
    })
  );

  return schedulesWithDetails;
}

export async function getScheduleById(id) {
  const schedules = await scheduleModel.getAllSchedulesWithTemplates({
    occurrenceId: id,
  });

  if (schedules.length === 0) {
    throw new Error("Schedule not found");
  }

  const schedule = schedules[0];

  const [assigned_technicians, assigned_assets] = await Promise.all([
    scheduleTechnicianModel.getScheduleTechniciansByOccurrenceId(schedule.id),
    scheduleAssetsModel.getAssignedAssetsByOccurrenceId(schedule.id),
  ]);

  return {
    ...schedule,
    assigned_technicians,
    assigned_assets,
  };
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
  const template =
    await scheduleTemplateModel.getScheduleTemplatesByOccurrenceId(id);
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  let item_unit_ids;

  const item = await itemModel.getItemByID(template.item_id);
  console.log({
    unitsForMaintenance: true,
    technicianDepartmentId: item.department_id,
    itemId: template.item_id,
  });

  // Fix: ACA should use PM logic for asset assignment
  if (template.type === "CM") {
    item_unit_ids = template.item_unit_id ? [template.item_unit_id] : [];
  } else {
    // This covers both PM and ACA types
    const itemUnits = await itemUnitModel.getAllItemUnits({
      unitsForMaintenance: true,
      technicianDepartmentId: item.department_id,
      itemId: template.item_id,
    });
    item_unit_ids = itemUnits.map((unit) => unit.id);
  }

  const startableStatuses = ["pending", "overdue"];
  if (!startableStatuses.includes(occurrence.status)) {
    throw new Error("Only pending or overdue schedules can be started");
  }

  if (item_unit_ids.length > 0) {
    await scheduleAssetsModel.assignAssets(id, item_unit_ids);
  } else {
    throw new Error(
      "Cannot start schedule because there are no asset units available."
    );
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

  await Promise.all(
    technicians.map((techId) =>
      userModel.updateUserPartial(techId, { status: "in_operation" })
    )
  );

  let unitStatus;
  if (template.type === "CM") unitStatus = "under_repair";
  else if (template.type === "PM") unitStatus = "under_maintenance";
  else if (template.type === "ACA") unitStatus = "under_assessment";
  else unitStatus = "unknown_status";

  for (const unitId of item_unit_ids) {
    await itemUnitModel.updateItemUnitPartial(unitId, {
      status: unitStatus,
      updated_at: new Date(),
    });

    await maintenanceRequestModel.updateMaintenanceRequest(
      unitId,
      "approved",
      "in_progress"
    );
  }

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

export async function updateScheduleAsset(
  id,
  unitId,
  performanceRating,
  physicalRating,
  review,
  isBroken,
  completedBy
) {
  const item = await itemUnitModel.getItemUnitByID(unitId);

  const usefulLifeRating =
    item.remaining_useful_life && item.useful_life
      ? item.remaining_useful_life / item.useful_life
      : 0;

  const newCondition =
    ((performanceRating / 100 + physicalRating / 100 + usefulLifeRating) / 3) *
    100;

  const updatedScheduledAsset =
    await scheduleAssetsModel.updateScheduleAssetStatus(
      id,
      unitId,
      review,
      parseInt(newCondition),
      completedBy
    );

  const occurrenceAssets =
    await scheduleAssetsModel.getAssignedAssetsByOccurrenceId(id);

  const allDone = occurrenceAssets.every((a) => a.status === "completed");

  if (allDone) {
    await completeScheduleOccurrence(id, completedBy);
  }

  await itemUnitModel.updateItemUnitPartial(unitId, {
    status: isBroken ? "broken" : "available",
    condition: parseInt(newCondition),
    updated_at: new Date(),
  });

  const activeRequests = await maintenanceRequestModel.getActiveRequestsByUnit(
    unitId
  );

  for (const req of activeRequests) {
    await maintenanceRequestModel.resolveRequest(req.id);

    await mailer.sendNewRegistrationNotification(
      req.requested_by,
      `${req.requestor_name}`,
      `${item.item_name} - ${item.unit_tag}`
    );
  }

  return updatedScheduledAsset;
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

  if (template.status === "active") {
    if (template.type === "PM") {
      await generateNextScheduleOccurrence(
        template.id,
        occurrence.scheduled_date,
        template.frequency_value,
        template.frequency_unit
      );
    }

    if (template.type === "ACA") {
      await generateNextACASchedule(template.id, occurrence.scheduled_date);
    }
  }

  return updated;
}

export async function completeScheduleOccurrence(id, completedBy) {
  const occurrence = await scheduleModel.getScheduleOccurrenceByID(id);
  if (!occurrence) throw new Error("Schedule not found");

  const completableStatuses = ["in_completion_request", "in_progress"];
  if (!completableStatuses.includes(occurrence.status)) {
    throw new Error("Only in-progress schedules can be completed");
  }

  const template = await scheduleTemplateModel.getScheduleTemplatesByID({
    templateId: occurrence.template_id,
  });
  if (!template) throw new Error("Template not found");

  const technicians =
    await scheduleTechnicianModel.getScheduleTechniciansByOccurrenceId(id);

  await Promise.all(
    technicians.map((t) =>
      userModel.updateUserPartial(t.id, { status: "inactive" })
    )
  );

  // Complete the occurrence
  const updated = await scheduleModel.updateScheduleOccurrencePartial(id, {
    status: "completed",
    completed_at: new Date(),
    completed_by: completedBy,
  });

  // Auto-generate next schedule if applicable
  if (template.status === "active") {
    if (template.type === "PM" || template.type === "ACA") {
      const nextDate =
        template.type === "PM"
          ? getNextPMScheduleDate(occurrence.scheduled_date)
          : getNextMonthFirstDay(occurrence.scheduled_date);

      await scheduleModel.createSchedule(template.id, nextDate);
    }

    if (template.type === "CM") {
      await scheduleTemplateModel.updateScheduleTemplatesPartial(template.id, {
        status: "stopped",
        updated_by: completedBy,
      });
    }
  }

  return updated;
}

/* ---------------- Helper Functions ---------------- */

function getNextPMScheduleDate(previousDate) {
  const prev = new Date(previousDate);
  const year = prev.getFullYear();
  const month = prev.getMonth();

  const firstMonday = getFirstMonday(year, month);
  const thirdMonday = getThirdMonday(year, month);

  if (prev.getDate() === firstMonday.getDate()) {
    // First Monday → schedule third Monday
    return thirdMonday;
  } else if (prev.getDate() === thirdMonday.getDate()) {
    // Third Monday → schedule next month's first Monday
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    return getFirstMonday(nextYear, nextMonth);
  } else {
    // Safety fallback: if for some reason the date isn't first or third Monday, default next month's first Monday
    let nextMonth = month + 1;
    let nextYear = year;
    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
    return getFirstMonday(nextYear, nextMonth);
  }
}

function getFirstMonday(year, month) {
  const date = new Date(year, month, 1);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

function getThirdMonday(year, month) {
  const firstMonday = getFirstMonday(year, month);
  const thirdMonday = new Date(firstMonday);
  thirdMonday.setDate(firstMonday.getDate() + 14);
  return thirdMonday;
}

function getNextMonthFirstDay(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}
