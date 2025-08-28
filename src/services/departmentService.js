import * as departmentModel from "../models/departmentModel.js";
import * as userModel from "../models/userModel.js";
import * as assetUnitModel from "../models/assetUnitModel.js";

export async function getAllDepartments(filters = {}) {
  return await departmentModel.getAllDepartments(filters);
}

export async function getDepartmentByID(id) {
  const department = await departmentModel.getDepartmentByID(id);
  if (!department) return null;

  const users = await userModel.getUsersFromDepartment(department.id);
  const units = await assetUnitModel.getAssetUnitsFromDepartment(department.id);

  return {
    ...department,
    users,
    units,
  };
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
