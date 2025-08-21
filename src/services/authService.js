const userModel = require("../models/userModel");
const resetModel = require('../models/resetRequestModel');
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/tokenUtils");

async function login(email, password) {
  const user = await userModel.getUserDataByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  const token = generateToken(user);
  return { token, user };
}

async function handlePasswordResetRequest(email) {
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

module.exports = { login, handlePasswordResetRequest };
