import * as requestModel from "../models/requestModel.js";
import * as issueReportModel from "../models/maintenanceRequestModel.js";
import * as assetRequestModel from "../models/assetRequestModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as subLocationAssetModel from "../models/subLocationAssetModel.js";

export async function getReportedAssets(filters = {}) {
  return await issueReportModel.getMaintenanceRequests(filters);
}

export async function getAssetRequests(filters = {}) {
  return await assetRequestModel.getAssetRequests(filters);
}

export async function getPurchaseRequestsById(id) {
  return await purchaseRequestModel.getPurchaseRequests(id);
}

export async function getMaintenanceRequests(filters = {}) {
  return await issueReportModel.getReportsAsMaintenanceRequest(filters);
}

export async function getProcurementRequests(filters = {}) {
  return await assetRequestModel.getRequestsAsProcurement(filters);
}

export async function getIssueReportsByAssetUnit(id) {
  return await issueReportModel.getRequestsByAssetUnit(id);
}

export async function getAssetRequestsByLocationAndAssetId(
  subLocationId,
  assetId
) {
  return await assetRequestModel.getAssetRequestsByLocationAndAssetId(
    subLocationId,
    assetId
  );
}

export async function createRequest(requestData) {
  if (
    requestData.request_type === "purchase" &&
    (requestData.department_id == null || requestData.department_id === "null")
  ) {
    throw new Error("Invalid department id");
  }

  let existing = [];

  switch (requestData.request_type) {
    case "issue":
      existing = await requestModel.getIssueReportByData(
        requestData.reporter_email,
        requestData.asset_unit_id,
        requestData.request_type
      );
      if (existing.length > 0) {
        const error = new Error(
          "You have already reported this asset. Please wait until it is resolved."
        );
        error.status = 409;
        throw error;
      }
      break;

    case "asset":
      existing = await requestModel.getAssetRequestByData(
        requestData.requester_email,
        requestData.sub_location_id,
        requestData.asset_id,
        requestData.request_type
      );
      if (existing.length > 0) {
        const error = new Error(
          "You already submitted an asset request for this location."
        );
        error.status = 409;
        throw error;
      }
      break;

    case "purchase":
      existing = await requestModel.getPurchaseRequests(
        requestData.requested_by,
        requestData.asset_id,
        requestData.request_type
      );
      if (existing.length > 0) {
        const error = new Error(
          "You already submitted a purchase request for this asset."
        );
        error.status = 409;
        throw error;
      }
      break;

    default:
      break;
  }

  const request = await requestModel.createRequest(requestData.request_type);
  if (!request) {
    throw new Error("Request creation failed");
  }

  const childData = { ...requestData, request_id: request.id };

  let childRecord;
  switch (requestData.request_type) {
    case "issue":
      childRecord = await issueReportModel.createMaintenanceRequest(childData);
      break;
    case "asset":
      childRecord = await assetRequestModel.createAssetRequest(childData);
      break;
    case "purchase":
      childRecord = await purchaseRequestModel.createPurchaseRequest(childData);
      break;
    case "account":
      childRecord = await accountRequestModel.createAccountRequest(childData);
      break;
    default:
      throw new Error(`Unsupported request_type: ${requestData.request_type}`);
  }

  return { request, details: childRecord };
}

export async function approveIssueReport(reportData) {
  if (!reportData.status) throw new Error("Missing status in reportData");

  const report = await requestModel.approveIssueReport(
    reportData.asset_unit_id,
    reportData.status,
    "issue"
  );
  if (!report)
    throw new Error(
      `No request found for asset_unit_id ${reportData.asset_unit_id}`
    );

  return report;
}

export async function approveAssetRequest(reportData) {
  if (!reportData.status) throw new Error("Missing status in reportData");

  const report = await requestModel.approveAssetRequest(
    reportData.asset_id,
    reportData.sub_location_id,
    reportData.status,
    "asset"
  );
  if (!report)
    throw new Error(`No request found for asset_id ${reportData.asset_id}`);

  await subLocationAssetModel.createSubLocationAsset({
    ...reportData,
    status: "pending",
  });

  return report;
}
