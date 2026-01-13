import db from "../config/db.js";

async function getPendingTransferLogs(id) {
  const { rows } = await db.query(
    "SELECT * FROM transfer_log WHERE status = 'pending'",
    [id]
  );
  return rows[0] || null;
}

async function getTransferLogs() {
  const { rows } = await db.query("SELECT * FROM transfer_log");
  return rows[0] || null;
}

async function getTransferLogsById(id) {
  const { rows } = await db.query(
    `
    SELECT 
      tl.*,
      fd.name AS previous_department,
      td.name AS current_department,
      CONCAT(u.first_name, ' ', u.last_name) AS created_by_name
    FROM transfer_log tl
    LEFT JOIN departments fd ON tl.from_department_id = fd.id
    LEFT JOIN departments td ON tl.to_department_id = td.id
    LEFT JOIN users u ON tl.created_by = u.id
    WHERE tl.item_unit_id = $1
    ORDER BY tl.created_at DESC
    `,
    [id]
  );
  return rows;
}


async function logTransfer(
  item_unit_id,
  from_department_id,
  to_department_id,
  created_by
) {
  const { rows } = await db.query(
    `
    INSERT INTO transfer_log (
      item_unit_id,
      from_department_id,
      to_department_id,
      created_by
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [item_unit_id, from_department_id, to_department_id, created_by]
  );
  return rows[0];
}


export {
  getPendingTransferLogs,
  getTransferLogs,
  getTransferLogsById,
  logTransfer,
};
