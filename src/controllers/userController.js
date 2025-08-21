const userService = require('../services/userService');

const getUsers = async (req, res) => {
  const filters = {
    role: req.query.role,
    departmentId: req.query.departmentId,
    isActive: req.query.isActive,
    // More Filters
  };

  const users = await userService.getAllUsers(filters);
  res.json(users);
};

const getUserDataByEmail = async (req, res) => {
  const { email } = req.params;
  const user = await userService.getUserDataByEmail(email);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
};

const getUserByID = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserDataById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(user);
};

const getMe = async (req, res) => {
  const user = await userService.getUserDataById(req.user.id);
  res.json(user);
};

const createUser = async (req, res) => {
  const createdUser = await userService.createUser(req.body);
  res.status(201).json(createdUser);
};

const deleteUsersByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error('IDs array is required');
  }
  await userService.deleteUsersByIDs(ids);
  res.json({ message: 'Users deleted successfully' });
};

const replaceUser = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateFullUser(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(updatedUser);
};

const updateUserPartial = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await userService.updateUserPartial(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json(updatedUser);
};

const deleteUserByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await userService.deleteUserByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ message: 'User deleted successfully' });
};

module.exports = {
  getUsers,
  getUserByID,
  getUserDataByEmail,
  getMe,
  createUser,
  deleteUsersByIDs,
  replaceUser,
  updateUserPartial,
  deleteUserByID,
};