import db from "../config/db.js";

async function getAllCompletionRequests(filters = {}) {
  let query = "SELECT * FROM completion_requests";
  const conditions = [];
  const values = [];

  if (filters.status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

export { getAllCompletionRequests };
