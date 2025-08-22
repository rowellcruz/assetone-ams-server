import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export async function getAllUsers(filters = {}) {
  return await userModel.getAllUsers(filters);
}

export async function getUserDataByEmail(email) {
  return await userModel.getUserDataByEmail(email);
}

export async function getUserDataById(id) {
  return await userModel.getUserDataById(id);
}

export async function createUser(userData) {
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

export async function deleteUsersByIDs(ids) {
  return await userModel.deleteUsersByIDs(ids);
}

export async function updateFullUser(id, userData) {
  return await userModel.updateFullUser(id, userData);
}

export async function updateUserPartial(id, fieldsToUpdate) {
  return await userModel.updateUserPartial(id, fieldsToUpdate);
}

export async function deleteUserByID(id) {
  return await userModel.deleteUserByID(id);
}
