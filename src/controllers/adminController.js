import * as adminService from "../services/adminService.js";
import * as authService from "../services/authService.js";

export async function getPendingRegistrations(req, res) {
  try {
    const pendingRegistrations = await adminService.getPendingRegistrations();
    res.status(200).json(pendingRegistrations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPendingRegistrationById(req, res) {
  const {id} = req.params;
  try {
    const pendingRegistrations = await adminService.getPendingRegistrationById(id);
    res.status(200).json(pendingRegistrations);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
}

export async function approveRegistration(req, res) {
  try {
    const { pendingId, adminId, departmentId, assignedRole } = req.body;
    const user = await authService.approveRegistration(pendingId, adminId, departmentId, assignedRole);
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