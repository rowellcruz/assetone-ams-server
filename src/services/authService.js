import * as userModel from "../models/userModel.js";
import * as resetModel from "../models/resetRequestModel.js";
import * as pendingRegistrationModel from "../models/pendingRegistrationModel.js";
import * as mailer from "../utils/mailer.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateToken } from "../utils/tokenUtils.js";

export async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await userModel.getUserDataByEmail(normalizedEmail);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  if (user.status === "disabled")
    throw new Error("Your account has been disabled. Please contact support.");

  const token = generateToken(user);
  return { token, user };
}

export async function registerPending(userData) {
  const { first_name, last_name, email, role } = userData;
  
  // Check if email already exists in users table
  const existingUser = await userModel.getUserDataByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Check if email already exists in pending registrations
  const existingPending = await pendingRegistrationModel.getByEmail(email);
  if (existingPending) {
    throw new Error("Registration already pending approval");
  }

  // Create pending registration
  await pendingRegistrationModel.create({
    first_name,
    last_name,
    email,
    role,
    status: 'pending'
  });

  // Optionally, send notification to admin about new registration
  // await mailer.sendNewRegistrationNotification(email, `${first_name} ${last_name}`, role);
}

export async function approveRegistration(pendingId, adminId, departmentId, assignedRole) {
  const pending = await pendingRegistrationModel.getById(pendingId);
  if (!pending) throw new Error("Pending registration not found");
  if (pending.status !== 'pending') throw new Error("Registration already processed");

  // Generate temporary password
  const temporaryPassword = crypto.randomBytes(8).toString('hex');
  
  // Hash the temporary password
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  // Create user in main users table with temporary password
  const userData = {
    first_name: pending.first_name,
    last_name: pending.last_name,
    email: pending.email,
    password: hashedPassword, // hashed temporary password
    role: assignedRole,
    department_id: departmentId,
    created_by: adminId
  };

  const user = await userModel.createUser(userData);

  // Update pending registration status
  await pendingRegistrationModel.updateStatus(pendingId, 'approved', adminId);

  // Send approval email to user with temporary password
  await mailer.sendRegistrationApproval(pending.email, pending.first_name, temporaryPassword, assignedRole);

  return user;
}

export async function rejectRegistration(pendingId, adminId) {
  const pending = await pendingRegistrationModel.getById(pendingId);
  if (!pending) throw new Error("Pending registration not found");
  if (pending.status !== 'pending') throw new Error("Registration already processed");
  // Update pending registration status
  await pendingRegistrationModel.updateStatus(pendingId, 'rejected', adminId);

  // Send rejection email to user
  await mailer.sendRegistrationRejection(pending.email, pending.first_name);
}

// -------------------- PASSWORD RESET FLOW --------------------

export async function handlePasswordResetRequest(email) {
  const user = await userModel.getUserDataByEmail(email);
  if (!user) {
    console.warn(`Password reset requested for non-existent email: ${email}`);
    return;
  }

  // generate secure token
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

  // remove existing tokens for this user
  await resetModel.deleteByUserId(user.id);

  // store new hashed token
  await resetModel.create({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
  });

  // send confirmation email with raw token - mailer will create the link
  await mailer.sendResetConfirmation(user.email, rawToken);
}

export async function handlePasswordResetConfirmation(rawToken, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const resetRecord = await resetModel.findByTokenHash(tokenHash);

  if (!resetRecord) throw new Error("InvalidOrExpiredToken");
  if (resetRecord.used) throw new Error("InvalidOrExpiredToken");
  if (new Date(resetRecord.expires_at) < new Date())
    throw new Error("InvalidOrExpiredToken");

  const user = await userModel.getUserDataById(resetRecord.user_id);
  if (!user) throw new Error("UserNotFound");

  // hash and update password
  const hashed = await bcrypt.hash(newPassword, 10);
  await userModel.updatePassword(user.id, hashed);

  // mark token used
  await resetModel.markUsed(resetRecord.id);
}

export async function changePassword(id, passwordData) {
  const user = await userModel.getUserDataById(id);
  if (!user) throw new Error("User not found");

  if (!passwordData.isNewAccount) {
    const isOldPasswordCorrect = await bcrypt.compare(passwordData.oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      throw new Error("Current password is incorrect");
    }
  }

  const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);
  await userModel.updatePassword(user.id, hashedNewPassword);
  await userModel.updateUserPartial(user.id, {is_password_updated: true});
}