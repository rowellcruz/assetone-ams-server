const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const resetModel = require("../models/resetRequestModel");
const mailer = require("../utils/mailer");

async function resetPasswordForUser(userId, tempPassword, adminId) {
  const hashed = await bcrypt.hash(tempPassword, 10);

  await userModel.updatePassword(userId, hashed);
  await resetModel.markApproved(userId, adminId);

  const user = await userModel.getUserDataById(userId);
  await mailer.sendTempPassword(user.email, tempPassword);
}

module.exports = { resetPasswordForUser };
