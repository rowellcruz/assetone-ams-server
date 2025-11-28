import * as userService from "../services/userService.js";

export const getUsers = async (req, res) => {
  const user = req.user;
  const filters = {
    role: req.query.role,
    departmentId: req.query.departmentId,
    isActive: req.query.isActive,
    status: req.query.status
  };

  if(user.role !== "system_administrator") {
    filters.excludeStatus = "deleted";
  }

  if (user.role === "asset_administrator") {
    filters.excludeRole = "system_administrator";
  }

  const users = await userService.getAllUsers(filters);
  res.json(users);
};

export const getUserDataByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await userService.getUserDataByEmail(email);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

export const getUserByID = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserDataById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

export const getMe = async (req, res) => {
  const user = await userService.getUserDataById(req.user.id);
  res.json(user);
};

export const createUser = async (req, res) => {
  const createdUser = await userService.createUser(req.body);
  res.status(201).json(createdUser);
};

export const deleteUsersByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await userService.deleteUsersByIDs(ids);
  res.json({ message: "Users deleted successfully" });
};

export const replaceUser = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateFullUser(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(updatedUser);
};

export const updateUserPartial = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateUserPartial(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(updatedUser);
};

export const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await userService.deleteUserByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({ message: "User deleted successfully" });
};
