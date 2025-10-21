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

async function getAttachmentsByTask(id) {
  const { rows } = await db.query(
    `SELECT * FROM procurement_attachments 
     WHERE purchase_request_id = $1 
     ORDER BY uploaded_at DESC`,
    [id]
  );
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