import * as maintenanceRequestModel from "../models/maintenanceRequestModel.js";
import * as userModel from "../models/userModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as mailer from "../utils/mailer.js";

export async function getMaintenanceRequests(filters = {}) {
  return await maintenanceRequestModel.getMaintenanceRequests(filters);
}

export async function getMaintenanceRequestsByItemUnitId(id, status) {
  return await maintenanceRequestModel.getMaintenanceRequestsByItemUnitId(
    id, status
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

  const itemUnitData = await itemUnitModel.getItemUnitByID(
      request.item_unit_id
    );

  const recipients =
    await userModel.getTechniciansAndAdminsByDepartment(
      itemUnitData.item_department_id
    );
    
    console.log("Recipients:", recipients);

  await Promise.all(
    recipients.map((user) =>
      mailer.sendReportMessage(
        user.email,
        request.requestor_name,
        `${itemUnitData.item_name} - ${itemUnitData.unit_tag}`
      )
    )
  );

  await mailer.sendSuccessReportMessage(
    request.requested_by,
    request.requestor_name,
    `${itemUnitData.item_name} - ${itemUnitData.unit_tag}`
  );

  return request;
}

export async function approveIssueReport(data) {
  const validStatuses = ["approved", "rejected"];
  if (!validStatuses.includes(data.status)) {
    throw new Error("Invalid report. Please try again.");
  }

  const updatedRows = await maintenanceRequestModel.updateMaintenanceRequest(
    data.item_unit_id,
    "pending",
    data.status
  );
  return updatedRows;
}
