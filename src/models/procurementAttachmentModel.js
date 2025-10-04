import db from "../config/db.js";

async function createAttachment(taskId, filePath, filename, mimeType, uploadedBy, module) {
  const { rows } = await db.query(
    `INSERT INTO attachments 
      (task_id, file_url, filename, mime_type, uploaded_by, module) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [taskId, filePath, filename, mimeType, uploadedBy, module]
  );
  return rows[0];
}

async function getAttachmentsByTask(taskId) {
  const { rows } = await db.query(
    `SELECT * FROM attachments 
     WHERE task_id = $1 
     ORDER BY uploaded_at DESC`,
    [taskId]
  );
  return rows;
}

async function deleteAttachment(id) {
  const { rows } = await db.query(
    `DELETE FROM attachments 
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