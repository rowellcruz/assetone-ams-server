import * as adminService from "../services/adminService.js";
import * as authService from "../services/authService.js";

export async function getPendingRegistrations(req, res) {
  const filters = {};
  if (req.query.status) filters.status = req.query.status;

  const pendingRegistrations = await adminService.getPendingRegistrations(
    filters
  );
  res.status(200).json(pendingRegistrations);
}

export async function getActivityLog(req, res) {
  const filters = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.startDate) filters.startDate = req.query.startDate;
  if (req.query.endDate) filters.endDate = req.query.endDate;
  if (req.query.userId) filters.userId = req.query.userId;
  if (req.query.module) filters.module = req.query.module;
  if (req.query.limit) filters.limit = parseInt(req.query.limit, 10);
  if (req.query.offset) filters.offset = parseInt(req.query.offset, 10);

  const activityLog = await adminService.getActivityLog(filters);
  res.status(200).json(activityLog);
}

export async function getActivityLogById(req, res) {
  const { id } = req.params;
  const activityLog = await adminService.getActivityLogById(id);
  res.status(200).json(activityLog);
}

export async function getPendingRegistrationById(req, res) {
  const { id } = req.params;
  const pendingRegistration = await adminService.getPendingRegistrationById(id);
  res.status(200).json(pendingRegistration);
}

export async function approveRegistration(req, res) {
  const { pendingId, adminId, departmentId, assignedRole } = req.body;
  const user = await authService.approveRegistration(
    pendingId,
    adminId,
    departmentId,
    assignedRole
  );
  res.status(200).json({
    message: "Registration approved and user created successfully.",
    user,
  });
}

export async function rejectRegistration(req, res) {
  const { pendingId, adminId } = req.body;
  await authService.rejectRegistration(pendingId, adminId);
  res.status(200).json({ message: "Registration rejected successfully." });
}
