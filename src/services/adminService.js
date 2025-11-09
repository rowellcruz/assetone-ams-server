import * as bcrypt from "bcrypt";
import * as userModel from "../models/userModel.js";
import * as resetModel from "../models/resetRequestModel.js";
import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as mailer from "../utils/mailer.js";

export async function resetPasswordForUser(userId, tempPassword, adminId) {
  const hashed = await bcrypt.hash(tempPassword, 10);

  await userModel.updatePassword(userId, hashed);
  await resetModel.markApproved(userId, adminId);

  const user = await userModel.getUserDataById(userId);
  await mailer.sendTempPassword(user.email, tempPassword);
}

export async function getPendingRegistrations() {
  return await pendingRegistrationModel.getAllPending();
}