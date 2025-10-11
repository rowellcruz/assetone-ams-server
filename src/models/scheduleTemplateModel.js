import db from "../config/db.js";

async function getAllScheduleTemplates(filters = {}) {
  let query = `
    SELECT st.*, a.type as asset_type
    FROM schedule_templates st
    LEFT JOIN assets a ON st.asset_id = a.id
  `;
  const conditions = [];
  const values = [];

  if (filters.type) {
    conditions.push(`st.type = $${values.length + 1}`);
    values.push(filters.type);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getScheduleTemplatesByID(id) {
  const { rows } = await db.query(
    `SELECT st.*, a.type as asset_type
    FROM schedule_templates st
    LEFT JOIN assets a ON st.asset_id = a.id
    WHERE st.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function getScheduleTemplatesByAssetID(assetId) {
  const { rows } = await db.query(
    `SELECT *
    FROM schedule_templates
    WHERE asset_id = $1`,
    [assetId]
  );
  return rows;
}

async function createScheduleTemplate(data) {
  const {
    asset_id,
    title,
    description,
    type,
    frequency_value,
    frequency_unit,
    grace_period_value,
    grace_period_unit,
    start_date,
    expiration_date,
    created_by,
    updated_by,
    updated_at,
  } = data;

  const { rows } = await db.query(
    `INSERT INTO schedule_templates (
    asset_id,
      title,
      description,
      type,
      frequency_value,
      frequency_unit,
    grace_period_value,
    grace_period_unit,
      start_date,
      expiration_date,
      created_by,
      updated_by,
      updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
    [
      asset_id,
      title,
      description,
      type,
      frequency_value,
      frequency_unit,
      grace_period_value,
      grace_period_unit,
      start_date,
      expiration_date,
      created_by,
      updated_by,
      updated_at,
    ]
  );
  return { id: rows[0].id, ...data };
}

async function updateScheduleTemplatesPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE schedule_templates SET ${setClause} WHERE id = $${
    keys.length + 1
  }`;

  await db.query(query, [...values, id]);
  return getScheduleTemplatesByID(id);
}

async function deleteScheduleTemplateByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM schedule_templates WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

async function deleteScheduleTemplatesByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM schedule_templates WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getAllScheduleTemplates,
  getScheduleTemplatesByID,
  getScheduleTemplatesByAssetID,
  createScheduleTemplate,
  updateScheduleTemplatesPartial,
  deleteScheduleTemplateByID,
  deleteScheduleTemplatesByIDs,
};
