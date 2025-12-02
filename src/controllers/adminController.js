import * as adminService from "../services/adminService.js";
import * as authService from "../services/authService.js";
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";

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

export async function backupData(req, res) {
  const user = req.user;
  const { confirmPassword } = req.body;

  if (user.role !== "system_administrator") {
    return res.status(403).json({ message: "Authorized user only" });
  }

  if (!confirmPassword) {
    return res.status(400).json({ message: "Password is required" });
  }

  const fullUser = await userModel.getUserDataById(user.id);
  if (!fullUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await bcrypt.compare(
    confirmPassword,
    fullUser.password
  );
  if (!passwordMatch) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  try {
    const backupInfo = await adminService.backupData();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${backupInfo.fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(backupInfo.filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: "Failed to create backup file" });
  }
}

// NEW: Get latest backup info
export async function getLatestBackup(req, res) {
  const user = req.user;

  if (user.role !== "system_administrator") {
    return res.status(403).json({ message: "Authorized user only" });
  }

  try {
    const latestBackup = await adminService.getLatestBackup();
    res.status(200).json(latestBackup);
  } catch (error) {
    res.status(500).json({ message: "Failed to get latest backup info" });
  }
}

// NEW: Get all backups
export async function getAllBackups(req, res) {
  const user = req.user;

  if (user.role !== "system_administrator") {
    return res.status(403).json({ message: "Authorized user only" });
  }

  try {
    const backups = await adminService.getAllBackups();
    res.status(200).json(backups);
  } catch (error) {
    res.status(500).json({ message: "Failed to get backup list" });
  }
}

// NEW: Download specific backup by ID
export async function downloadBackupById(req, res) {
  const user = req.user;
  const { id } = req.params;

  if (user.role !== "system_administrator") {
    return res.status(403).json({ message: "Authorized user only" });
  }

  try {
    const backupInfo = await adminService.getBackupById(id);
    
    if (!fs.existsSync(backupInfo.filePath)) {
      return res.status(404).json({ message: "Backup file not found" });
    }
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${backupInfo.fileName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(backupInfo.filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    if (error.message === "Backup not found") {
      return res.status(404).json({ message: "Backup not found" });
    }
    res.status(500).json({ message: "Failed to download backup" });
  }
}