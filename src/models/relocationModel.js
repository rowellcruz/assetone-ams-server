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
    "SELECT * FROM relocation_log WHERE item_unit_id = $1",
    [id]
  );
  return rows[0] || null;
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
