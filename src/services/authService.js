import * as userModel from "../models/userModel.js";
import * as resetModel from "../models/resetRequestModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/tokenUtils.js";

export async function login(email, password) {
  const user = await userModel.getUserDataByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = generateToken(user);
  return { token, user };
}

export async function handlePasswordResetRequest(email) {
  const user = await userModel.getUserDataByEmail(email);

  if (!user) {
    console.warn(`Password reset requested for non-existent email: ${email}`);
    return;
  }

  const existing = await resetModel.findByUserId(user.id);
  if (existing) {
    console.warn(`Password reset requested again for user ID ${user.id}`);
    return;
  }

  await resetModel.create(user.id);
}
