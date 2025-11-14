import * as scheduleService from "../services/scheduleService.js";

export const getSchedules = async (req, res) => {
  const filters = {
    status: req.query.status,
  };

  const schedules = await scheduleService.getAllSchedules(filters);
  res.json(schedules);
};

export const getAllSchedulesWithTemplates = async (req, res) => {
  const user = req.user;
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (user.role === "property_custodian")
    filters.departmentId = user.department_id;
  const schedules = await scheduleService.getAllSchedulesWithTemplates(filters);
  res.json(schedules);
};

export const getScheduleUnitsByTechnician = async (req, res) => {
  const { id } = req.params;
  const units = await scheduleService.getScheduleUnitsByTechnician(id);
  res.json(units);
};

export const updateScheduleAssetStatus = async (req, res) => {
  const { id, unitId } = req.params;
  const scheduleAsset = await scheduleService.updateScheduleAsset(id, unitId);
  res.json(scheduleAsset);
};

export const getScheduleOccurrencesByTemplateId = async (req, res) => {
  const { id } = req.params;

  const schedules = await scheduleService.getScheduleByTemplateId(id);
  res.json(schedules);
};

export const getAssignedAssetsByTemplateId = async (req, res) => {
  const { id } = req.params;

  const assets = await scheduleService.getAssignedAssetsByTemplateId(id);
  res.json(assets);
};

export const getScheduleOccurrencesByAssetUnitId = async (req, res) => {
  const { assetUnitId } = req.params;
  const schedules = await scheduleService.getScheduleOccurrencesByAssetUnitId(
    assetUnitId
  );
  res.json(schedules);
};

export const startScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { started_by, technicians, asset_unit_ids } = req.body;

  const updated = await scheduleService.startScheduleOccurrence(
    id,
    started_by,
    technicians,
    asset_unit_ids
  );

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const completeScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { completed_by } = req.body;

  const updated = await scheduleService.completeScheduleOccurrence(
    id,
    completed_by
  );

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const rejectScheduleOccurrence = async (req, res) => {
  const { id } = req.params;

  const updated = await scheduleService.rejectScheduleOccurrence(id, req.body);

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};

export const skipScheduleOccurrence = async (req, res) => {
  const { id } = req.params;
  const { skipped_by, reason } = req.body;

  const updated = await scheduleService.skipScheduleOccurrence(
    id,
    skipped_by,
    reason
  );

  if (!updated) {
    res.status(404);
    throw new Error("Schedule not found");
  }

  res.json(updated);
};
