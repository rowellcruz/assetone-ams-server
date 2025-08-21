const db = require("../config/db");

async function create(userId) {
  await db.query("INSERT INTO password_reset_requests (user_id) VALUES (?)", [
    userId,
  ]);
}

async function findByUserId(userId) {
  const [rows] = await db.query(
    'SELECT * FROM password_reset_requests WHERE user_id = ? AND status = "pending"',
    [userId]
  );
  return rows[0];
}

async function markApproved(userId, adminId) {
  await db.query(
    `
    UPDATE password_reset_requests 
    SET status = 'approved', approved_by = ?, approved_at = NOW() 
    WHERE user_id = ? AND status = 'pending'
  `,
    [adminId, userId]
  );
}

module.exports = { create, findByUserId, markApproved };
