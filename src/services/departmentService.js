import * as departmentModel from "../models/departmentModel.js";
import * as userModel from "../models/userModel.js";
import * as assetUnitModel from "../models/assetUnitModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";

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

export async function updatePurchaseRequestPartial(id, fieldsToUpdate) {
  return await purchaseRequestModel.updatePurchaseRequestPartial(
    id,
    fieldsToUpdate
  );
}

export async function distributeUnits(id, requestData) {
  const availableUnits = await assetUnitModel.getAllAssetUnits({
    assetId: requestData.asset_id,
    departmentId: null,
  });

  const requestedQty = Number(requestData.quantity);
  const availableQty = availableUnits.length;

  const distributableQty = Math.min(requestedQty, availableQty);

  for (let i = 0; i < distributableQty; i++) {
    await assetUnitModel.updateAssetUnitPartial(availableUnits[i].id, {
      department_id: requestData.department_id,
    });
  }

  let newStatus;
  if (distributableQty === 0) {
    throw new Error("No units available to distribute");
  } else if (distributableQty < requestedQty) {
    newStatus = "pending";
  } else {
    newStatus = "approved";
  }

  const updated = await purchaseRequestModel.distributeUnits(id, {
    status: newStatus,
    distributed_quantity: distributableQty,
    requested_quantity: requestedQty,
    updated_at: new Date(),
  });

  return updated;
}

export async function deleteDepartmentByID(id) {
  return await departmentModel.deleteDepartmentByID(id);
}
