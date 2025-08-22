import * as adminService from "../services/adminService.js";

export async function resetUserPassword(req, res) {
  try {
    const { userId, tempPassword, adminId } = req.body;
    await adminService.resetPasswordForUser(userId, tempPassword, adminId);
    res.status(200).json({ message: "Temporary password sent to user." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
