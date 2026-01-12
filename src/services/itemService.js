import PDFDocument from "pdfkit";
import * as itemModel from "../models/itemModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as scheduleTemplateService from "../services/scheduleTemplateService.js";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import path from "path";
import * as XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_BASE_URL = process.env.CLIENT_URLS.split(",")[1];

export async function getAllItems(filters = {}) {
  return await itemModel.getAllItems(filters);
}

export async function getItemByID(id) {
  return await itemModel.getItemByID(id);
}

export async function generateStickersPDF(unitIds) {
  const generateQR = (text) => QRCode.toBuffer(text);
  const units = await itemUnitModel.getItemUnitsByIds(unitIds);

  const doc = new PDFDocument({ size: "A4", margin: 10 });
  const buffers = [];
  doc.on("data", (d) => buffers.push(d));

  const stickerW = doc.page.width / 2 - 15;
  const stickerH = 140;
  let x = 10,
    y = 10;

  for (const u of units) {
    doc.rect(x, y, stickerW, stickerH).stroke();

    const padding = 8;
    let curY = y + padding;

    // Logo
    doc.image(
      path.join(__dirname, "../assets/dycilogocircle.jpeg"),
      x + padding,
      curY,
      { width: 30 }
    );

    // Title
    doc
      .fontSize(7)
      .font("Helvetica-Bold")
      .text("DR. YANGA'S COLLEGES, INC.", x, curY, {
        width: stickerW,
        align: "center",
      });

    doc
      .fontSize(4)
      .font("Helvetica-Bold")
      .text("GENERAL SERVICES OFFICE", x, curY + 9, {
        width: stickerW,
        align: "center",
      });

    doc
      .fontSize(7)
      .font("Helvetica")
      .text("GENERAL SERVICES OFFICE\nPROPERTY TAG", x, curY + 15, {
        width: stickerW,
        align: "center",
      });

    // QR Code
    const qrUrl = `${FRONTEND_BASE_URL}/report-issue/${u.id}`;
    const qr = await generateQR(qrUrl);
    doc.image(qr, x + stickerW - 55, curY - 5, { width: 50 });

    curY += 45;

    const row = (label, val) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(`${label}:`, x + padding, curY);
      doc
        .font("Helvetica")
        .fontSize(7)
        .text(val || "-", x + 90, curY);
      curY += 12;
    };

    row("CODE", u.unit_tag);
    row("DESCRIPTION", u.item_name);
    row("LOCATION/AREA", u.full_location_name);

    curY += 2;

    // Signature blocks as columns
    const sigTitles = [
      { title: "Accountable Person", position: "Officer-in-Charge" },
      { title: "Checked by", position: "GSO Officer" },
      { title: "Noted by", position: "Vice President for Operations" },
    ];

    const columnWidth = (stickerW - padding * 2) / 3;
    let sigY = curY;

    sigTitles.forEach((sig, i) => {
      const colX = x + padding + i * columnWidth;

      doc.font("Helvetica-Bold").fontSize(6).text(sig.title, colX, sigY);
      doc
        .font("Helvetica")
        .fontSize(6)
        .text("__________________________", colX, sigY + 8);
      doc
        .font("Helvetica")
        .fontSize(6)
        .text(sig.position, colX, sigY + 16);
    });

    curY += 30; // move down after signature row

    // Footer
    doc.fontSize(7).text("PLEASE DO NOT REMOVE", x, curY, {
      width: stickerW,
      align: "center",
    });

    // Move to next sticker position
    if (x + stickerW * 2 + 20 <= doc.page.width) {
      x += stickerW + 15;
    } else {
      x = 10;
      y += stickerH + 10;
      if (y + stickerH > doc.page.height) {
        doc.addPage();
        y = 10;
      }
    }
  }

  doc.end();
  return new Promise((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(buffers)))
  );
}

export async function importItems(file, user) {
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const categoryRow = rows[0];

  const categoryMap = {};
  for (let i = 0; i < categoryRow.length; i += 3) {
    if (categoryRow[i]) {
      categoryMap[i] = String(categoryRow[i]).trim();
    }
  }

  const headerRow = rows[1];
  const dataRows = rows.slice(2);

  const groups = [];
  for (let i = 0; i < headerRow.length; i += 3) {
    groups.push({
      codeIndex: i,
      nameIndex: i + 1,
    });
  }

  const created = [];
  const errors = [];

  for (const row of dataRows) {
    for (const g of groups) {
      const code = row[g.codeIndex];
      const name = row[g.nameIndex];

      if (!code || !name) continue;

      const itemData = {
        code: String(code).trim(),
        name: String(name).trim(),
        category: categoryMap[g.codeIndex],
        department_id: user.department_id,
        created_by: user.id,
        updated_by: user.id,
      };

      try {
        const item = await createItem(itemData);
        created.push(item);
      } catch (e) {
        errors.push({ code, name, error: e.message });
      }
    }
  }

  return {
    createdCount: created.length,
    errorCount: errors.length,
    errors,
  };
}

export async function createItem(itemData) {
  const existingItem = await itemModel.getItemByName(
    itemData.name.toLowerCase()
  );
  if (existingItem) throw new Error("Asset name already exists");

  const newItem = await itemModel.createItem(itemData);
  const pmDescription = `Preventive Maintenance for ${newItem.name}`;

  const today = new Date();
  const firstMonday = getFirstMonday(today.getFullYear(), today.getMonth());
  const thirdMonday = new Date(firstMonday);
  thirdMonday.setDate(firstMonday.getDate() + 14);

  let pmDate;

  if (today <= firstMonday) {
    pmDate = firstMonday;
  } else if (today <= thirdMonday) {
    pmDate = thirdMonday;
  } else {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    pmDate = getFirstMonday(nextMonth.getFullYear(), nextMonth.getMonth());
  }

  await scheduleTemplateService.createScheduleTemplate({
    item_id: newItem.id,
    type: "PM",
    description: pmDescription,
    start_date: pmDate,
  });

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  await scheduleTemplateService.createScheduleTemplate({
    item_id: newItem.id,
    type: "ACA",
    description: `Monthly ${newItem.name} condition assessment`,
    start_date: firstDayOfMonth,
  });

  return newItem;
}

function getFirstMonday(year, month) {
  const date = new Date(year, month, 1);
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }
  return date;
}

export async function updateItemPartial(id, fieldsToUpdate) {
  return await itemModel.updateItemPartial(id, fieldsToUpdate);
}

export async function deleteItemByID(id) {
  return await itemModel.deleteItemByID(id);
}

export async function deleteItemsByIDs(ids) {
  return await itemModel.deleteItemsByIDs(ids);
}
