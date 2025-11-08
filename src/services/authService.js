import * as userModel from "../models/userModel.js";
import * as resetModel from "../models/resetRequestModel.js";
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

  // send confirmation email with link
  const clientUrls = process.env.CLIENT_URLS
    ? process.env.CLIENT_URLS.split(",").map((url) => url.trim())
    : ["https://assetone-client.vercel.app"];

  const frontendUrl =
    process.env.NODE_ENV === "development"
      ? clientUrls.find((url) => url.includes("localhost")) || clientUrls[0]
      : clientUrls[0];

  const resetLink = `${frontendUrl}/reset-password?token=${rawToken}`;

  await mailer.sendResetConfirmation(user.email, resetLink);
}

// Called by /reset-password API after user clicks link and enters new password
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
