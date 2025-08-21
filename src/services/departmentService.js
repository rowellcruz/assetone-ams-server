const departmentModel = require("../models/departmentModel");

async function getAllDepartments(filters = {}) {
  return await departmentModel.getAllDepartments(filters);
}

async function getDepartmentByID(id) {
  return await departmentModel.getDepartmentByID(id);
}

async function createDepartment(departmentData) {
  return await departmentModel.createDepartment(departmentData);
}

async function deleteDepartmentsByIDs(ids) {
  return await departmentModel.deleteDepartmentsByIDs(ids);
}

async function updateFullDepartment(id, departmentData) {
  return await departmentModel.updateFullDepartment(id, departmentData);
}

async function updateDepartmentPartial(id, fieldsToUpdate) {
  return await departmentModel.updateDepartmentPartial(id, fieldsToUpdate);
}

async function deleteDepartmentByID(id) {
  return await departmentModel.deleteDepartmentByID(id);
}

module.exports = {
  getAllDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartmentsByIDs,
  updateFullDepartment,
  updateDepartmentPartial,
  deleteDepartmentByID,
};
