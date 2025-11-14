import db from "../config/db.js";

async function getById(id) {
  const { rows } = await db.query("SELECT * FROM pending_registration WHERE id = $1", [id]);
  return rows[0];
}

async function getByEmail(email) {
  const { rows } = await db.query("SELECT * FROM pending_registration WHERE email = $1", [email]);
  return rows[0];
}

async function getAllPending() {
  const { rows } = await db.query(
    "SELECT * FROM pending_registration ORDER BY created_at DESC"
  );
  return rows;
}

async function create(registrationData) {
  const { first_name, last_name, email, role, status = 'pending' } = registrationData;
  
  const { rows } = await db.query(
    `INSERT INTO pending_registration 
     (first_name, last_name, email, role, status) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [first_name, last_name, email, role, status]
  );
  
  return rows[0];
}

async function updateStatus(id, status, adminId = null) {
  const { rows } = await db.query(
    `UPDATE pending_registration 
     SET status = $1, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [status, id]
  );
  
  return rows[0];
}

async function deleteById(id) {
  const { rowCount } = await db.query("DELETE FROM pending_registration WHERE id = $1", [id]);
  return rowCount > 0;
}

export {
  getById,
  getByEmail,
  getAllPending,
  create,
  updateStatus,
  deleteById
};