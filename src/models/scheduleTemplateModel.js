const db = require("../config/db");

async function getAllScheduleTemplates(filters = {}) {
  let query = "SELECT * FROM schedule_templates";
  const conditions = [];
  const values = [];

  if (filters.type) {
    conditions.push("type = ?");
    values.push(filters.type);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.execute(query, values);
  return rows;
}

async function getScheduleTemplatesByID(id) {
  const [rows] = await db.execute(
    "SELECT * FROM schedule_templates WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function createScheduleTemplate(data) {
  const {
    title,
    description,
    type,
    frequency_value,
    frequency_unit,
    start_date,
    status,
    expiration_date,
    created_by,
    updated_by,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO schedule_templates (
    title,
    description,
    type,
    frequency_value,
    frequency_unit,
    start_date,
    status,
    expiration_date,
    created_by,
    updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      type,
      frequency_value,
      frequency_unit,
      start_date,
      status,
      expiration_date,
      created_by,
      updated_by,
    ]
  );
  return { id: result.insertId, ...data };
}

async function updateScheduleTemplatesPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE schedule_templates SET ${setClause} WHERE id = ?`;

  await db.execute(query, [...values, id]);
  return getScheduleTemplatesByID(id);
}

async function deleteScheduleTemplateByID(id) {
  const [result] = await db.execute(
    "DELETE FROM schedule_templates WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}

async function deleteScheduleTemplatesByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(", ");
  const [result] = await db.execute(
    `DELETE FROM schedule_templates WHERE id IN (${placeholders})`,
    ids
  );
  return result.affectedRows;
}

module.exports = {
  getAllScheduleTemplates,
  getScheduleTemplatesByID,
  createScheduleTemplate,
  updateScheduleTemplatesPartial,
  deleteScheduleTemplateByID,
  deleteScheduleTemplatesByIDs,
};
