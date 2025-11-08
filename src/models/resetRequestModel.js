import db from "../config/db.js";

async function findByUserId(userId) {
  const { rows } = await db.query(
    `SELECT * FROM password_reset_tokens WHERE user_id = $1 AND status = 'pending'`,
    [userId]
  );
  return rows[0];
}

async function markApproved(userId, adminId) {
  await db.query(
    `
    UPDATE password_reset_tokens 
    SET status = 'approved', approved_by = $1, approved_at = NOW() 
    WHERE user_id = $2 AND status = 'pending'
  `,
    [adminId, userId]
  );
}

export async function create({ user_id, token_hash, expires_at }) {
  const query = `
    INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
  `;
  await db.query(query, [user_id, token_hash, expires_at]);
}

export async function findByTokenHash(token_hash) {
  const { rows } = await db.query(
    "SELECT * FROM password_reset_tokens WHERE token_hash = $1 LIMIT 1",
    [token_hash]
  );
  return rows[0];
}

export async function deleteByUserId(user_id) {
  await db.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [user_id]);
}

export async function markUsed(id) {
  await db.query("UPDATE password_reset_tokens SET used = TRUE WHERE id = $1", [id]);
}

export { findByUserId, markApproved };
