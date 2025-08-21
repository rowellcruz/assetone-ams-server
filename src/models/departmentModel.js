const db = require('../config/db');

async function getAllDepartments(filters) {
  const [rows] = await db.query('SELECT * FROM departments');
  return rows;
}

async function getDepartmentByID(id) {
  const [rows] = await db.query('SELECT * FROM departments WHERE id = ?', [id]);
  return rows[0];
}

async function createDepartment(departmentData) {
  const { name, created_by, updated_by } = departmentData;
  const [result] = await db.query(
    "INSERT INTO departments (name, created_by, updated_by) VALUES (?, ?, ?)",
    [name, created_by, updated_by]
  );
  return { id: result.insertId, ...departmentData };
}

async function deleteDepartmentsByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => "?").join(", ");
  await db.query(`DELETE FROM departments WHERE id IN (${placeholders})`, ids);
}

async function updateFullDepartment(id, departmentData) {
  const { name, updated_by } = departmentData;
  const [result] = await db.query(
    "UPDATE departments SET name = ?, updated_by = ? WHERE id = ?",
    [name, updated_by, id]
  );
  return result.affectedRows > 0 ? { id, ...departmentData } : null;
}

async function updateDepartmentPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const [result] = await db.query(`UPDATE departments SET ${updates} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return result.affectedRows > 0 ? { id, ...fields } : null;
}

async function deleteDepartmentByID(id) {
  const [result] = await db.query("DELETE FROM departments WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartmentsByIDs,
  updateFullDepartment,
  updateDepartmentPartial,
  deleteDepartmentByID,
};
