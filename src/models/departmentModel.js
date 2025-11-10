import db from '../config/db.js';

async function getAllDepartments(filters) {
  const { rows } = await db.query(`
    SELECT d.*, COUNT(u.id) AS user_count, l.name || ' - ' || sl.name AS full_location_name
    FROM departments d
    LEFT JOIN users u ON u.department_id = d.id
    LEFT JOIN sub_locations sl ON d.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    GROUP BY d.id, l.name, sl.name
  `);
  return rows;
}

async function getDepartmentByID(id) {
  const { rows } = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
  return rows[0];
}

async function createDepartment(departmentData) {
  const { name, code, sub_location_id, created_by, updated_by } = departmentData;
  const { rows } = await db.query(
    "INSERT INTO departments (name, code, sub_location_id, created_by, updated_by) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [name, code, sub_location_id, created_by, updated_by]
  );
  return { id: rows[0].id, ...departmentData };
}

async function deleteDepartmentsByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(`DELETE FROM departments WHERE id IN (${placeholders})`, ids);
}

async function updateFullDepartment(id, departmentData) {
  const { name, updated_by } = departmentData;
  const { rowCount } = await db.query(
    "UPDATE departments SET name = $1, updated_by = $2 WHERE id = $3",
    [name, updated_by, id]
  );
  return rowCount > 0 ? { id, ...departmentData } : null;
}

async function updateDepartmentPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(`UPDATE departments SET ${updates} WHERE id = $${keys.length + 1}`, [
    ...values,
    id,
  ]);
  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteDepartmentByID(id) {
  const { rowCount } = await db.query("DELETE FROM departments WHERE id = $1", [id]);
  return rowCount > 0;
}

export {
  getAllDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartmentsByIDs,
  updateFullDepartment,
  updateDepartmentPartial,
  deleteDepartmentByID,
};
