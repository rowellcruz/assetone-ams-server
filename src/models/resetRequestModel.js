import db from "../config/db.js";

async function create(userId) {
  await db.query("INSERT INTO password_reset_requests (user_id) VALUES ($1)", [userId]);
}

async function findByUserId(userId) {
  const { rows } = await db.query(
    `SELECT * FROM password_reset_requests WHERE user_id = $1 AND status = 'pending'`,
    [userId]
  );
  return rows[0];
}

async function markApproved(userId, adminId) {
  await db.query(
    `
    UPDATE password_reset_requests 
    SET status = 'approved', approved_by = $1, approved_at = NOW() 
    WHERE user_id = $2 AND status = 'pending'
  `,
    [adminId, userId]
  );
}

export { create, findByUserId, markApproved };
