import db from "../config/db.js";

async function getMaintenanceHistory(filters = {}) {
  let query = `
    SELECT 
      su.item_unit_id,
      su.completed_at,
      su.condition,
      so.started_at,
      st.type AS occurrence_type
    FROM schedule_units su
    JOIN schedule_occurrences so ON su.occurrence_id = so.id
    JOIN schedule_templates st ON so.template_id = st.id
  `;

  
  const conditions = [`so.status = 'completed'`];
  const values = [];

  if (filters.item_unit_id) {
    conditions.push(`su.item_unit_id = $${values.length + 1}`);
    values.push(filters.item_unit_id);
  }

  if (filters.startDate) {
    conditions.push(`so.started_at >= $${values.length + 1}`);
    values.push(filters.startDate);
  }

  if (filters.endDate) {
    conditions.push(`so.started_at <= $${values.length + 1}`);
    values.push(filters.endDate);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY su.item_unit_id, so.started_at DESC`;

  const { rows } = await db.query(query, values);
  return rows || [];
}

export { getMaintenanceHistory };
