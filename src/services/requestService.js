import * as requestModel from "../models/requestModel.js";
import * as issueReportModel from "../models/issueReportModel.js";
import * as assetRequestModel from "../models/assetRequestModel.js";
import * as accountRequestModel from "../models/accountRequestModel.js";

export async function getIssueReports(filters = {}) {
  return await issueReportModel.getIssueReports(filters);
}

export async function getAssetRequests(filters = {}) {
  return await assetRequestModel.getAssetRequests(filters);
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
      
    default:
      break;
  }

  const request = await requestModel.createRequest(requestData.request_type);

  const childData = { ...requestData, request_id: request.id };

  let childRecord;
  switch (requestData.request_type) {
    case "issue":
      childRecord = await issueReportModel.createIssueReport(childData);
      break;
    case "asset":
      childRecord = await assetRequestModel.createAssetRequest(childData);
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

  const report = await requestModel.approveIssueReport(reportData.asset_unit_id, reportData.status, "issue");
  if (!report) throw new Error(`No request found for asset_unit_id ${reportData.asset_unit_id}`);

  return report;
}

export async function approveAssetRequest(reportData) {
  if (!reportData.status) throw new Error("Missing status in reportData");

  const report = await requestModel.approveAssetRequest(reportData.asset_id, reportData.sub_location_id, reportData.status, "asset");
  if (!report) throw new Error(`No request found for asset_id ${reportData.asset_id}`);

  return report;
}
