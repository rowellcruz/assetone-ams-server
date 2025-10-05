import * as reportModel from "../models/reportModel.js";
import * as userModel from "../models/userModel.js";
import { generatePDF } from "../utils/pdfGenerator.js";

export const generateReport = async (reportType, filters, userId) => {
  if(!userId) {
    throw new Error ("Invalid UID");
  }
  const user = await userModel.getUserDataById(userId);

  let data;

  switch (reportType) {
    case "asset":
      data = await reportModel.getAssets(filters);
      break;
    case "asset-unit":
      data = await reportModel.getAssetUnits(filters);
      break;
    case "maintenance-schedule":
      data = await reportModel.getMaintenanceSchedules(filters);
      break;
    case "procurement":
      data = await reportModel.getProcurements(filters);
      break;
    case "purchase-request":
      data = await reportModel.getPurchaseRequests(filters);
      break;
    case "user":
      data = await reportModel.getUsers(filters);
      break;
    case "activity-log":
      data = await reportModel.getActivityLogs(filters);
      break;
    case "department":
      data = await reportModel.getDepartments(filters);
      break;
    case "location":
      data = await reportModel.getLocations(filters);
      break;
    case "vendor":
      data = await reportModel.getVendors(filters);
      break;
    default:
      throw new Error("Unknown report type");
  }
  
  const pdfBuffer = await generatePDF(reportType, data, user);
  return pdfBuffer;
};
