import * as requestModel from "../models/requestModel.js";

export async function getIssueReports(filters = {}) {
  return await requestModel.getIssueReports(filters);
}

export async function getRequestsByAssetUnit(id) {
  return await requestModel.getRequestsByAssetUnit(id);
}

export async function createRequest(requestData) {
  const existing = await requestModel.getRequestByData(
    requestData.reporter_email,
    requestData.asset_unit_id
  );

  if (existing.length > 0) {
    const error = new Error(
      "You have already reported this asset. Please wait until it is resolved."
    );
    error.status = 409;
    throw error;
  }

  const request = await requestModel.createRequest(requestData);
  return request;
}

export async function handleReportApproval(id, status) {
  return await requestModel.approveIssueReport(id, status);
}