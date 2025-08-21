const db = require("../config/db");

async function getUserDataByEmail(email) {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

async function getAllUsers(filters) {
  let sql = `SELECT 
    id, first_name, last_name, email, role,
    contact_number, secondary_email, department_id,
    priority_score, user_status, availability_status,
    created_at, created_by, updated_at, updated_by,
    is_deleted, deleted_at, deleted_by
  FROM users`;
  const conditions = [];
  const values = [];

  if (filters.role) {
    conditions.push("role = ?");
    values.push(filters.role);
  }

  if (filters.departmentId) {
    conditions.push("department_id = ?");
    values.push(filters.departmentId);
  }

  if (filters.isActive !== undefined) {
    conditions.push("is_active = ?");
    values.push(filters.isActive);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.query(sql, values);
  return rows;
}

async function getUserDataById(id) {
  const [rows] = await db.query(
    `SELECT
    id, first_name, last_name, email, role,
    contact_number, secondary_email, department_id,
    priority_score, user_status, availability_status,
    created_at, created_by, updated_at, updated_by,
    is_deleted, deleted_at, deleted_by
  FROM users WHERE id = ?;`,
    [id]
  );
  return rows[0];
}

async function createUser(userData) {
  const { first_name, last_name, email, password, role, department_id, priority_score } = userData;
  const [result] = await db.query(
    "INSERT INTO users (first_name, last_name, email, password, role, department_id, priority_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [first_name, last_name, email, password, role, department_id, priority_score]
  );
  return { id: result.insertId, ...userData };
}

async function deleteUsersByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => "?").join(", ");
  await db.query(`DELETE FROM users WHERE id IN (${placeholders})`, ids);
}

async function updateFullUser(id, userData) {
  const { first_name, last_name, email, password, role } = userData;
  const [result] = await db.query(
    "UPDATE users SET first_name = ?, last_name = ?, email = ?, role = ?, password = ? WHERE id = ?",
    [first_name, last_name, email, password, role, id]
  );
  return result.affectedRows > 0 ? { id, ...userData } : null;
}

async function updateUserPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const [result] = await db.query(`UPDATE users SET ${updates} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return result.affectedRows > 0 ? { id, ...fields } : null;
}

async function updatePassword(id, hash) {
  await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, id]);
}

async function deleteUserByID(id) {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getUserDataByEmail,
  getAllUsers,
  getUserDataById,
  createUser,
  updateFullUser,
  updateUserPartial,
  updatePassword,
  deleteUserByID,
  deleteUsersByIDs,
};
