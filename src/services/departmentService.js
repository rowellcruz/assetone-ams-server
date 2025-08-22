import * as departmentModel from "../models/departmentModel.js";

export async function getAllDepartments(filters = {}) {
  return await departmentModel.getAllDepartments(filters);
}

export async function getDepartmentByID(id) {
  return await departmentModel.getDepartmentByID(id);
}

export async function createDepartment(departmentData) {
  return await departmentModel.createDepartment(departmentData);
}

export async function deleteDepartmentsByIDs(ids) {
  return await departmentModel.deleteDepartmentsByIDs(ids);
}

export async function updateFullDepartment(id, departmentData) {
  return await departmentModel.updateFullDepartment(id, departmentData);
}

export async function updateDepartmentPartial(id, fieldsToUpdate) {
  return await departmentModel.updateDepartmentPartial(id, fieldsToUpdate);
}

export async function deleteDepartmentByID(id) {
  return await departmentModel.deleteDepartmentByID(id);
}
