import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export const generatePDF = async (reportType, data = [], user = {}) => {
  const doc = new PDFDocument({ size: "Legal", margin: 50 });
  const stream = new PassThrough();
  doc.pipe(stream);

  // --- HEADER ---
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logoPath = path.resolve(__dirname, "../assets/dycilogo.jpeg");

  if (fs.existsSync(logoPath)) {
    try {
      const logoWidth = 90;
      const logoHeight = 30;
      const x = (doc.page.width - logoWidth) / 2;
      doc.image(logoPath, x, 30, { width: logoWidth, height: logoHeight });
    } catch (err) {
      console.error("Error adding logo to PDF:", err.message);
    }
  }

  // Space below logo
  doc.moveDown(3);

  // Title (capitalize first letter, avoid repeating "Report")
  const titleText = reportType
    ? reportType.charAt(0).toUpperCase() + reportType.slice(1).replace("-", " ")
    : "Report";

  doc.font("Helvetica-Bold").fontSize(20).text(titleText, { align: "center" });

  // Generated date
  doc
    .font("Helvetica")
    .fontSize(10)
    .text(`Report created at: ${new Date().toLocaleDateString()}`, {
      align: "right",
    });

  doc.moveDown(2);

  // --- TABLE ---
  let y = doc.y; // define y here so it exists outside table block
  if (data.length === 0) {
    doc.text("No data available.", { align: "center" });
  } else {
    const columns = Object.keys(data[0]);
    const colWidth = (doc.page.width - 100) / columns.length;

    // Table header with background
    const headerHeight = 25;
    doc.rect(50, y, doc.page.width - 100, headerHeight).fill("#e0e0e0");
    doc.fillColor("#000000").font("Helvetica-Bold");
    columns.forEach((col, i) => {
      doc.text(
        col.charAt(0).toUpperCase() + col.slice(1),
        50 + i * colWidth + 5,
        y + 7,
        { width: colWidth - 10, align: "left" }
      );
    });

    y += headerHeight + 5;
    doc.font("Helvetica").fillColor("#000000");

    const rowHeight = 20;
    data.forEach((item) => {
      columns.forEach((col, i) => {
        let value = item[col];
        if (value instanceof Date) value = value.toLocaleString();
        if (value === undefined || value === null) value = "-";

        doc.text(value.toString(), 50 + i * colWidth + 5, y + 5, {
          width: colWidth - 10,
          align: "left",
        });
      });
      y += rowHeight;

      // Check if we need a page break
      if (y + rowHeight > doc.page.height - 70) {
        doc.addPage();
        y = 50; // reset y for new page
      }
    });
  }

  // --- FOOTER: Reported by at bottom of last page ---
  if (user && user.first_name && user.last_name) {
    const bottomMargin = 50; // same as doc margin
    let yPosition = doc.page.height - bottomMargin - 30; // leave extra space for name

    // Make sure it doesn't overlap table
    if (y > yPosition) {
      doc.addPage();
      yPosition = doc.page.height - bottomMargin - 30;
    }

    doc.fontSize(10).text("Reported by:", 50, yPosition, { align: "left" });
    doc
      .fontSize(10)
      .text(`${user.first_name} ${user.last_name}`, 50, yPosition + 15, {
        align: "left",
      });
  }

  doc.end();

  return await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};
