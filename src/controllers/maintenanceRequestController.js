import * as maintenanceRequestsService from "../services/maintenanceRequestsService.js";

export const getMaintenanceRequests = async (req, res) => {
  const user = req.user;
  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (user.department_id === null || user.department_id === undefined || user.department_id === 0)
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
  const { requested_by } = req.body;

  if (!requested_by) {
    return res.status(400).json({ message: "requested_by is required" });
  }

  const email = requested_by.trim().toLowerCase();
  const allowedDomains = ["gmail.com", "hotmail.com", "outlook.com", "dyci.edu.ph"];
  const domain = email.split("@")[1];

  if (!domain || !allowedDomains.includes(domain)) {
    return res.status(400).json({ message: "Email not allowed" });
  }

  const createdRequest = await maintenanceRequestsService.createMaintenanceRequest(req.body);
  res.status(201).json(createdRequest);
};

export const handleReportApproval = async (req, res) => {
  const reportData = req.body;
  const createdRequest = await maintenanceRequestsService.approveIssueReport(
    reportData
  );
  res.status(201).json(createdRequest);
};
