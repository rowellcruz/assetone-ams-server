const db = require("../config/db");

async function getAllCompletionRequests(filters = {}) {
  let query = "SELECT * FROM completion_requests";
  const conditions = [];
  const values = [];

  if (filters.status) {
    conditions.push("status = ?");
    values.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.execute(query, values);
  return rows;
}

module.exports = {
  getAllCompletionRequests,
};
