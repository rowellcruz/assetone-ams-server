import db from "../config/db.js";

async function getAllSchedules(filters = {}) {
  let query = "SELECT * FROM schedule_occurrences";
  const conditions = [];
  const values = [];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getScheduleOccurrenceByID(id) {
  const { rows } = await db.query("SELECT * FROM schedule_occurrences WHERE id = $1", [id]);
  return rows[0] || null;
}

async function getAllScheduleOccurrencesWithTemplate(filters = {}) {
  let query = `
    SELECT * FROM (
      SELECT 
        st.type, st.frequency_value, st.frequency_unit, st.title AS template_title, 
        st.description AS template_description, st.start_date AS template_start_date,
        st.status AS template_status, st.expiration_date AS template_expiration_date,
        st.created_by AS template_created_by, st.updated_by AS template_updated_by,
        st.created_at AS template_created_at, st.updated_at AS template_updated_at,
        so.id AS id,
        so.template_id,
        so.scheduled_date,
        so.status,
        so.started_at,
        so.started_by,
        so.completed_at,
        so.completed_by,
        so.skipped_at,
        so.skipped_by,
        so.skipped_reason,
        so.skipped_context,
        so.created_at AS occurrence_created_at,
        so.updated_at AS occurrence_updated_at,
        FALSE AS is_unplanned
      FROM 
        schedule_occurrences AS so
      JOIN 
        schedule_templates AS st ON so.template_id = st.id

      UNION

      SELECT 
        st.type, st.frequency_value, st.frequency_unit, st.title AS template_title, 
        st.description AS template_description, st.start_date AS template_start_date,
        st.status AS template_status, st.expiration_date AS template_expiration_date,
        st.created_by AS template_created_by, st.updated_by AS template_updated_by,
        st.created_at AS template_created_at, st.updated_at AS template_updated_at,
        NULL AS id,
        st.id AS template_id,
        NULL AS scheduled_date,
        'unplanned' AS status,
        NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL,
        NULL AS occurrence_created_at,
        NULL AS occurrence_updated_at,
        TRUE AS is_unplanned
      FROM 
        schedule_templates AS st
      WHERE 
        NOT EXISTS (
          SELECT 1 FROM schedule_occurrences so WHERE so.template_id = st.id
        )
        AND st.start_date IS NULL
    ) AS combined_schedules
  `;

  const conditions = [];
  const values = [];

  if (filters.templateId) {
    conditions.push(`template_id = $${values.length + 1}`);
    values.push(filters.templateId);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY scheduled_date IS NULL, scheduled_date ASC`;

  const { rows } = await db.query(query, values);
  return rows;
}

async function createSchedule(template_id, start_date) {
  const { rows } = await db.query(
    "INSERT INTO schedule_occurrences (template_id, scheduled_date) VALUES ($1, $2) RETURNING id",
    [template_id, start_date]
  );
  return { id: rows[0].id, template_id, scheduled_date: start_date };
}

async function updateScheduleOccurrencePartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE schedule_occurrences SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getScheduleOccurrenceByID(id);
}

async function deleteScheduleOccurrenceByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM schedule_occurrences WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

async function deleteScheduleOccurrencesByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM schedule_occurrences WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getAllSchedules,
  getAllScheduleOccurrencesWithTemplate,
  getScheduleOccurrenceByID,
  createSchedule,
  updateScheduleOccurrencePartial,
  deleteScheduleOccurrenceByID,
  deleteScheduleOccurrencesByIDs,
};
