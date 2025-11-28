import db from "../config/db.js";

async function getById(id) {
  const { rows } = await db.query(
    "SELECT * FROM pending_registration WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function getByEmail(email) {
  const { rows } = await db.query(
    "SELECT * FROM pending_registration WHERE email = $1",
    [email]
  );
  return rows[0];
}

async function getAllPending(filters = {}) {
  let query = "SELECT * FROM pending_registration";

  const conditions = [];
  const values = [];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += ` ORDER BY created_at DESC`;

  const { rows } = await db.query(query, values);
  return rows;
}

async function getPendingRegistrationById(id) {
  const { rows } = await db.query(
    "SELECT * FROM pending_registration WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function create(registrationData) {
  const { first_name, last_name, email, status = "pending" } = registrationData;

  const { rows } = await db.query(
    `INSERT INTO pending_registration 
     (first_name, last_name, email, status) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [first_name, last_name, email, status]
  );

  return rows[0];
}

async function updateStatus(id, status, adminId) {
  const { rows } = await db.query(
    `UPDATE pending_registration 
     SET status = $1, updated_at = CURRENT_TIMESTAMP, approved_by = $3 
     WHERE id = $2 
     RETURNING *`,
    [status, id, adminId]
  );

  return rows[0];
}

async function deleteById(id) {
  const { rowCount } = await db.query(
    "DELETE FROM pending_registration WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export {
  getById,
  getByEmail,
  getAllPending,
  getPendingRegistrationById,
  create,
  updateStatus,
  deleteById,
};
