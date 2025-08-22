import db from "../config/db.js";

async function getUserDataByEmail(email) {
  const { rows } = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return rows[0];
}

async function getAllUsers(filters = {}) {
  let sql = `SELECT 
    id, first_name, last_name, email, role,
    contact_number, secondary_email, department_id,
    priority_score, user_status, availability_status,
    created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
  FROM users`;
  const conditions = [];
  const values = [];

  if (filters.role) {
    conditions.push(`role = $${values.length + 1}`);
    values.push(filters.role);
  }

  if (filters.departmentId) {
    conditions.push(`department_id = $${values.length + 1}`);
    values.push(filters.departmentId);
  }

  if (filters.isActive !== undefined) {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(filters.isActive);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(sql, values);
  return rows;
}

async function getUserDataById(id) {
  const { rows } = await db.query(
    `SELECT
    id, first_name, last_name, email, role,
    contact_number, secondary_email, department_id,
    priority_score, user_status, availability_status,
    created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
  FROM users WHERE id = $1;`,
    [id]
  );
  return rows[0];
}

async function createUser(userData) {
  const {
    first_name,
    last_name,
    email,
    password,
    role,
    department_id,
    priority_score,
  } = userData;
  const { rows } = await db.query(
    `INSERT INTO users (first_name, last_name, email, password, role, department_id, priority_score) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [
      first_name,
      last_name,
      email,
      password,
      role,
      department_id,
      priority_score,
    ]
  );
  return { id: rows[0].id, ...userData };
}

async function deleteUsersByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM users WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

async function updateFullUser(id, userData) {
  const { first_name, last_name, email, password, role } = userData;
  const { rowCount } = await db.query(
    `UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4, password = $5 WHERE id = $6`,
    [first_name, last_name, email, role, password, id]
  );
  return rowCount > 0 ? { id, ...userData } : null;
}

async function updateUserPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1}`;

  const values = Object.values(fields);
  const { rowCount } = await db.query(query, [...values, id]);
  return rowCount > 0 ? { id, ...fields } : null;
}

async function updatePassword(id, hash) {
  await db.query("UPDATE users SET password = $1 WHERE id = $2", [hash, id]);
}

async function deleteUserByID(id) {
  const { rowCount } = await db.query("DELETE FROM users WHERE id = $1", [id]);
  return rowCount > 0;
}

export {
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
