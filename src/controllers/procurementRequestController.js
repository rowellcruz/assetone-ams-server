import * as requestService from "../services/requestService.js";

export const getProcurementRequests = async (req, res) => {
  const reports = await requestService.getProcurementRequests(req.body);
  res.status(201).json(reports);
};

export const getIssueReportsByAssetUnit = async (req, res) => {
  const { id } = req.params;
  const reports = await requestService.getIssueReportsByAssetUnit(id);
  res.status(201).json(reports);
};

export const createRequest = async (req, res) => {
  const createdRequest = await requestService.createRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const createdRequest = await requestService.approveProcurementRequest(id, status);
  res.status(201).json(createdRequest);
};