import db from "../config/db.js";

async function getAllActivityLog(filters = {}) {
  let query = `
    SELECT 
      al.id,
      al.user_id,
      u.first_name || ' ' || u.last_name AS user_name,
      u.email AS user_email,
      u.role AS user_role,
      al.module,
      al.action,
      al.endpoint,
      al.method,
      al.request_body,
      al.ip_address,
      al.user_agent,
      al.status_code,
      al.created_at
    FROM activity_log al
    LEFT JOIN users u ON al.user_id = u.id
  `;

  const conditions = [];
  const values = [];

  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`al.created_at >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`al.created_at <= $${values.length}`);
  }

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`al.user_id = $${values.length}`);
  }

  if (filters.module) {
    values.push(filters.module);
    conditions.push(`al.module = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY al.created_at DESC";

  if (filters.limit) {
    values.push(filters.limit);
    query += ` LIMIT $${values.length}`;
  }

  if (filters.offset) {
    values.push(filters.offset);
    query += ` OFFSET $${values.length}`;
  }

  const { rows } = await db.query(query, values);
  return rows;
}


async function getActivityLogById(id) {
  const { rows } = await db.query(`
    SELECT 
      al.id,
      al.user_id,
      u.first_name || ' ' || u.last_name AS user_name,
      u.email AS user_email,
      u.role AS user_role,
      al.module,
      al.action,
      al.endpoint,
      al.method,
      al.request_body,
      al.ip_address,
      al.user_agent,
      al.status_code,
      al.created_at
    FROM activity_log al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.id = $1
    ORDER BY al.created_at DESC
  `, [id]);

  return rows[0];
}

async function getTopModuleUsage(filters = {}) {
  let query = `
    SELECT 
      al.module,
      COUNT(*) AS count
    FROM activity_log al
  `;

  const conditions = [];
  const values = [];

  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`al.created_at >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`al.created_at <= $${values.length}`);
  }

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`al.user_id = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += `
    GROUP BY al.module
    ORDER BY count DESC
    LIMIT 4
  `;

  const { rows } = await db.query(query, values);
  return rows;
}

export { getAllActivityLog, getActivityLogById, getTopModuleUsage };
