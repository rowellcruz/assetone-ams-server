import pool from '../config/db.js';

export const logActivity = async ({ userId, module, action, endpoint, method, body, ip, userAgent }) => {
  try {
    await pool.query(
      `INSERT INTO activity_log 
        (user_id, module, action, endpoint, method, request_body, ip_address, user_agent)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [userId, module, action, endpoint, method, body, ip, userAgent]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};
