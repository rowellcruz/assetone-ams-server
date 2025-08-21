const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

async function getAllUsers(filters = {}) {
  return await userModel.getAllUsers(filters);
}

async function getUserDataByEmail(email) {
  return await userModel.getUserDataByEmail(email);
}

async function getUserDataById(id) {
  return await userModel.getUserDataById(id);
}

async function createUser(userData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };
    return await userModel.createUser(userWithHashedPassword);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Email already exists");
    }
    throw err;
  }
}


async function deleteUsersByIDs(ids) {
  return await userModel.deleteUsersByIDs(ids);
}

async function updateFullUser(id, userData) {
  return await userModel.updateFullUser(id, userData);
}

async function updateUserPartial(id, fieldsToUpdate) {
  return await userModel.updateUserPartial(id, fieldsToUpdate);
}

async function deleteUserByID(id) {
  return await userModel.deleteUserByID(id);
}

module.exports = {
  getAllUsers,
  getUserDataByEmail,
  getUserDataById,
  createUser,
  deleteUsersByIDs,
  updateFullUser,
  updateUserPartial,
  deleteUserByID,
};