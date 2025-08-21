const departmentService = require("../services/departmentService");

const getDepartments = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
    // More filters if needed
  };

  const departments = await departmentService.getAllDepartments(filters);
  res.json(departments);
};

const getDepartmentByID = async (req, res) => {
  const { id } = req.params;
  const department = await departmentService.getDepartmentByID(id);
  if (!department) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(department);
};

const createDepartment = async (req, res) => {
  const createdDepartment = await departmentService.createDepartment(req.body);
  res.status(201).json(createdDepartment);
};

const deleteDepartmentsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await departmentService.deleteDepartmentsByIDs(ids);
  res.json({ message: "Departments deleted successfully" });
};

const replaceDepartment = async (req, res) => {
  const { id } = req.params;
  const updatedDepartment = await departmentService.updateFullDepartment(id, req.body);
  if (!updatedDepartment) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(updatedDepartment);
};

const updateDepartmentPartial = async (req, res) => {
  const { id } = req.params;
  const updatedDepartment = await departmentService.updateDepartmentPartial(id, req.body);
  if (!updatedDepartment) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json(updatedDepartment);
};

const deleteDepartmentByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await departmentService.deleteDepartmentByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Department not found");
  }
  res.json({ message: "Department deleted successfully" });
};

module.exports = {
  getDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartmentsByIDs,
  replaceDepartment,
  updateDepartmentPartial,
  deleteDepartmentByID,
};
