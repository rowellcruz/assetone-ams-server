import db from "../config/db.js";

async function createAttachment(id, filePath, filename, mimeType, uploadedBy, module) {
  const { rows } = await db.query(
    `INSERT INTO procurement_attachments 
      (purchase_request_id, file_path, file_name, mime_type, uploaded_by, module) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [id, filePath, filename, mimeType, uploadedBy, module]
  );
  return rows[0];
}

async function getAttachmentsByTask(id, filters = {}) {
  let query = `
    SELECT * 
    FROM procurement_attachments 
    WHERE purchase_request_id = $1
  `;

  const values = [id];
  const conditions = [];

  // Optional filters
  if (filters.uploadedBy) {
    conditions.push(`uploaded_by = $${values.length + 1}`);
    values.push(filters.uploadedBy);
  }

  if (filters.module) {
    conditions.push(`module = $${values.length + 1}`);
    values.push(filters.module);
  }

  if (filters.dateFrom) {
    conditions.push(`uploaded_at >= $${values.length + 1}`);
    values.push(filters.dateFrom);
  }

  if (filters.dateTo) {
    conditions.push(`uploaded_at <= $${values.length + 1}`);
    values.push(filters.dateTo);
  }

  if (filters.isDeleted !== undefined) {
    if (filters.isDeleted) {
      conditions.push(`deleted_at IS NOT NULL`);
    } else {
      conditions.push(`deleted_at IS NULL`);
    }
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += " ORDER BY uploaded_at DESC";

  const { rows } = await db.query(query, values);
  return rows;
}


async function deleteAttachment(id) {
  const { rows } = await db.query(
    `DELETE FROM procurement_attachments 
     WHERE id = $1 
     RETURNING *`,
    [id]
  );
  return rows[0];
}

export {
  createAttachment,
  getAttachmentsByTask,
  deleteAttachment,
};