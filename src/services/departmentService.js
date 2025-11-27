import * as departmentModel from "../models/departmentModel.js";
import * as userModel from "../models/userModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as requestModel from "../models/requestModel.js";

export async function getAllDepartments(filters = {}) {
  return await departmentModel.getAllDepartments(filters);
}

export async function getDepartmentByID(id) {
  return await departmentModel.getDepartmentByID(id);
}

export async function getAvailableTechnicians(id) {
  return await userModel.getAvailableTechniciansFromDepartment(id);
}

export async function createDepartment(departmentData) {
  if (departmentData.code) {
    departmentData.code = departmentData.code.toUpperCase();
  }

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
  const requestedQty = Number(requestData.requested_quantity);
  if (isNaN(requestedQty)) {
    throw new Error(
      `Invalid requested quantity: ${requestData.requested_quantity}`
    );
  }

  const availableUnits = await itemUnitModel.getAllAssetUnits({
    assetId: requestData.asset_id,
    departmentId: null,
  });

  const availableQty = availableUnits.length;
  const distributableQty = Math.min(requestedQty, availableQty);

  if (isNaN(distributableQty)) {
    throw new Error(`Invalid distributable quantity derived from request`);
  }

  for (let i = 0; i < distributableQty; i++) {
    await itemUnitModel.updateAssetUnitPartial(availableUnits[i].id, {
      department_id: requestData.department_id,
    });
  }

  let newStatus;
  if (distributableQty === 0)
    throw new Error("No units available to distribute");
  else if (distributableQty < requestedQty) newStatus = "pending";
  else newStatus = "approved";

  await purchaseRequestModel.updatePurchaseRequestPartial(id, {
    distributed_quantity: distributableQty,
    requested_quantity: requestedQty,
    updated_at: new Date(),
  });

  const updatedRequest = await requestModel.updateRequestPartial(
    Number(requestData.request_id),
    {
      status: newStatus,
      updated_at: new Date(),
    }
  );

  return updatedRequest;
}

export async function deleteDepartmentByID(id) {
  return await departmentModel.deleteDepartmentByID(id);
}
