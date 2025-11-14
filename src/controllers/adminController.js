import * as adminService from "../services/adminService.js";
import * as authService from "../services/authService.js";

export async function resetUserPassword(req, res) {
  try {
    const { userId, tempPassword, adminId } = req.body;
    await adminService.resetPasswordForUser(userId, tempPassword, adminId);
    res.status(200).json({ message: "Temporary password sent to user." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPendingRegistrations(req, res) {
  try {
    const pendingRegistrations = await adminService.getPendingRegistrations();
    res.status(200).json(pendingRegistrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function approveRegistration(req, res) {
  try {
    const { pendingId, adminId, departmentId } = req.body;
    const user = await authService.approveRegistration(pendingId, adminId, departmentId);
    res.status(200).json({ 
      message: "Registration approved and user created successfully.",
      user 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function rejectRegistration(req, res) {
  try {
    const { pendingId, adminId } = req.body;
    await authService.rejectRegistration(pendingId, adminId);
    res.status(200).json({ message: "Registration rejected successfully." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}