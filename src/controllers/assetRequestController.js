import * as requestService from "../services/requestService.js";

export const getAssetRequests = async (req, res) => {
  const reports = await requestService.getAssetRequests(req.body);
  res.status(201).json(reports);
};

export const getAssetRequestsByLocationAndAssetId = async (req, res) => {
  const { subLocationId, assetId } = req.params;
  const reports = await requestService.getAssetRequestsByLocationAndAssetId(subLocationId, assetId);
  res.status(201).json(reports);
};

export const createRequest = async (req, res) => {
  const createdRequest = await requestService.createRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const reportData = req.body;
  const createdRequest = await requestService.approveAssetRequest(reportData);
  res.status(201).json(createdRequest);
};