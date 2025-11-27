import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as userModel from "../models/userModel.js"; // Assuming getUserByEmail is here

export async function getPendingRegistrations() {
  return await pendingRegistrationModel.getAllPending();
}

export async function getPendingRegistrationById(id) {
  const registration = await pendingRegistrationModel.getPendingRegistrationById(id);
  if (!registration) throw new Error("Registration not found");

  if (registration.status === "approved") {
    const users = await userModel.getAllUsers({ email: registration.email });
    const user = users && users.length > 0 ? users[0] : null;

    if (user) {
      return {
        ...registration,
        role: user.role,
        department: user.department_name
      };
    }
  }

  return registration;
}
