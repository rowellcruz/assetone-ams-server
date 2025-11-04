import * as maintenanceRequestModel from "../models/maintenanceRequestModel.js";

export async function getMaintenanceRequests(filters = {}) {
  return await maintenanceRequestModel.getMaintenanceRequests(filters);
}

export async function getMaintenanceRequestsByItemUnitId(filters = {}) {
  return await maintenanceRequestModel.getMaintenanceRequestsByItemUnitId(
    filters
  );
}

export async function createMaintenanceRequest(data) {
  const { requested_by, item_unit_id } = data;
  const existingRequests =
    await maintenanceRequestModel.getExistingMaintenanceRequestsByData({
      requested_by,
      item_unit_id,
    });

  if (existingRequests.length > 0) {
    const error = new Error(
      "You have already reported this asset. Please wait until it is resolved."
    );
    error.status = 409;
    throw error;
  }
  
  const request = await maintenanceRequestModel.createMaintenanceRequest(data);
  return request;
}
