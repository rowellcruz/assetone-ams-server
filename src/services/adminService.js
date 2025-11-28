import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as userModel from "../models/userModel.js";
import * as activityLogModel from "../models/activityLogModel.js";

export async function getPendingRegistrations(filters = {}) {
  return await pendingRegistrationModel.getAllPending(filters);
}

export async function getActivityLog(filters = {}) {
  return await activityLogModel.getAllActivityLog(filters);
}

export async function getActivityLogById(id) {
  return await activityLogModel.getActivityLogById(id);
}

export async function getPendingRegistrationById(id) {
  const registration =
    await pendingRegistrationModel.getPendingRegistrationById(id);
  if (!registration) throw new Error("Registration not found");

  if (registration.status === "approved") {
    const users = await userModel.getAllUsers({ email: registration.email });
    const user = users && users.length > 0 ? users[0] : null;

    if (user) {
      return {
        ...registration,
        role: user.role,
        department: user.department_name,
      };
    }
  }

  return registration;
}
