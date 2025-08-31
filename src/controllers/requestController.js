import * as requestService from "../services/requestService.js";

export const getIssueReports = async (req, res) => {
  const reports = await requestService.getIssueReports(req.body);
  res.status(201).json(reports);
};

export const getRequestsByAssetUnit = async (req, res) => {
  const { id } = req.params;
  const reports = await requestService.getRequestsByAssetUnit(id);
  res.status(201).json(reports);
};

export const createRequest = async (req, res) => {
  const createdRequest = await requestService.createRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const createdRequest = await requestService.handleReportApproval(id, status);
  res.status(201).json(createdRequest);
};