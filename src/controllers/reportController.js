import * as reportService from "../services/reportService.js";

export const getReport = async (req, res) => {
  const { reportType } = req.params;
  const userId = req.user.id;
  const filters = req.query;

  const pdfBuffer = await reportService.generateReport(reportType, filters, userId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename=${reportType}.pdf`);
  res.send(pdfBuffer);
};
