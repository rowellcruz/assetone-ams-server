import * as purchaseRequestModel from "../models/purchaseRequestModel.js";

export async function getPurchaseRequestsByDepartment(departmentId) {
  return await purchaseRequestModel.getPurchaseRequests(departmentId);
}

export async function createPurchaseRequest(purchaseRequestData) {
  return await purchaseRequestModel.createPurchaseRequest(purchaseRequestData);
}

export async function updatePurchaseRequestPartial(id, fieldsToUpdate) {
  return await purchaseRequestModel.updatePurchaseRequestPartial(
    id,
    fieldsToUpdate
  );
}