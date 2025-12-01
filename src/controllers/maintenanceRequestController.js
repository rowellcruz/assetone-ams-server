import * as maintenanceRequestsService from "../services/maintenanceRequestsService.js";

export const getMaintenanceRequests = async (req, res) => {
  const user = req.user;
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (user.department_id === null || user.department_id === undefined)
    filters.departmentId = null;
  if (user.department_id) filters.departmentId = user.department_id;

  const reports = await maintenanceRequestsService.getMaintenanceRequests(
    filters
  );
  res.status(201).json(reports);
};

export const getMaintenanceRequestsByItemUnitId = async (req, res) => {
  const { id, status } = req.params;
  const reports =
    await maintenanceRequestsService.getMaintenanceRequestsByItemUnitId(
      id,
      status
    );
  res.status(201).json(reports);
};

export const createRequest = async (req, res) => {
  const createdRequest =
    await maintenanceRequestsService.createMaintenanceRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const reportData = req.body;
  const createdRequest = await maintenanceRequestsService.approveIssueReport(
    reportData
  );
  res.status(201).json(createdRequest);
};
