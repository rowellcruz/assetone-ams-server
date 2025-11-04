import * as maintenanceRequestsService from "../services/maintenanceRequestsService.js";

export const getMaintenanceRequests = async (req, res) => {
  const reports = await maintenanceRequestsService.getMaintenanceRequests(req.body);
  res.status(201).json(reports);
};

export const getMaintenanceRequestsByItemUnitId = async (req, res) => {
  const { id } = req.params;
  const reports = await maintenanceRequestsService.getMaintenanceRequestsByItemUnitId(id);
  res.status(201).json(reports);
};

export const createRequest = async (req, res) => {
  const createdRequest = await maintenanceRequestsService.createMaintenanceRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const reportData = req.body;
  const createdRequest = await requestService.approveIssueReport(reportData);
  res.status(201).json(createdRequest);
};