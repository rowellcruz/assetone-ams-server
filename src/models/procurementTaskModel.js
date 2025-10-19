import db from "../config/db.js";

async function getProcurementTasks(filters = {}) {
  let query = `
    SELECT st.*, a.type as asset_type
    FROM procurement_tasks st
    LEFT JOIN assets a ON st.asset_id = a.id
  `;
  const conditions = [];
  const values = [];

  if (filters.type) {
    conditions.push(`a.type = $${values.length + 1}`);
    values.push(filters.type);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getProcurementTaskByID(id) {
  const { rows } = await db.query("SELECT * FROM procurement_tasks WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createProcurementTask(data) {
  const { asset_id, quantity, estimated_cost_per_unit, description, created_by, updated_by, updated_at } = data;

  const { rows } = await db.query(
    `INSERT INTO procurement_tasks 
      (category_id, quantity, estimated_cost_per_unit, description, created_by, updated_by, updated_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) 
     RETURNING id`,
    [asset_id, quantity, estimated_cost_per_unit, description, created_by, updated_by, updated_at]
  );

  return { 
    id: rows[0].id, 
    asset_id, 
    quantity, 
    estimated_cost_per_unit,
    description, 
    created_by, 
    updated_by,
    updated_at
  };
}


async function updateProcurementTaskPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE procurement_tasks SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getProcurementTaskByID(id);
}

async function deleteProcurementTaskByID(id) {
  const { rowCount } = await db.query("DELETE FROM procurement_tasks WHERE id = $1", [id]);
  return rowCount > 0;
}

async function deleteProcurementTasksByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM procurement_tasks WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getProcurementTasks,
  createProcurementTask,
  getProcurementTaskByID,
  updateProcurementTaskPartial,
  deleteProcurementTaskByID,
  deleteProcurementTasksByIDs,
};
