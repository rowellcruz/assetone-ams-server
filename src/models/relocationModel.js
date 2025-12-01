import db from "../config/db.js";

async function getPendingRelocationLogs(id) {
  const { rows } = await db.query(
    "SELECT * FROM relocation_log WHERE status = 'pending'",
    [id]
  );
  return rows[0] || null;
}

async function getRelocationLogs() {
  const { rows } = await db.query("SELECT * FROM relocation_log", [id]);
  return rows[0] || null;
}

async function getRelocationLogsById(id) {
  const { rows } = await db.query(
    `
    SELECT 
      rl.*,
      CONCAT(fs.name, ' - ', fl.name) AS previous_location,
      CONCAT(ts.name, ' - ', tl.name) AS current_location,
      CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
    FROM relocation_log rl
    LEFT JOIN sub_locations fs ON rl.from_sub_location_id = fs.id
    LEFT JOIN locations fl ON fs.location_id = fl.id
    LEFT JOIN sub_locations ts ON rl.to_sub_location_id = ts.id
    LEFT JOIN locations tl ON ts.location_id = tl.id
    LEFT JOIN users u ON rl.created_by = u.id
    WHERE rl.item_unit_id = $1
    ORDER BY rl.created_at DESC
    `,
    [id]
  );
  return rows;
}


async function logRelocation(
  item_unit_id,
  from_sub_location_id,
  to_sub_location_id,
  created_by
) {
  const { rows } = await db.query(
    "INSERT INTO relocation_log (item_unit_id, from_sub_location_id, to_sub_location_id, created_by) VALUES ($1, $2, $3, $4) RETURNING id",
    [item_unit_id, from_sub_location_id, to_sub_location_id, created_by]
  );
  return rows[0];
}

export {
  getPendingRelocationLogs,
  getRelocationLogs,
  getRelocationLogsById,
  logRelocation,
};
