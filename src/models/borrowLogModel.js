import db from "../config/db.js";

async function getBorrowLogs() {
  const { rows } = await db.query(`
    SELECT 
      bl.*,
      iu.unit_tag AS item_unit_tag,
      CONCAT(u.first_name, ' ', u.last_name) AS lender_name
    FROM borrow_logs bl
    LEFT JOIN item_units iu ON bl.item_unit_id = iu.id
    LEFT JOIN users u ON bl.lend_by = u.id
  `);
  return rows;
}

async function getBorrowLogsByItemUnitId(item_unit_id) {
  const { rows } = await db.query(`
    SELECT 
      bl.*,
      iu.name AS item_name,
      CONCAT(u.first_name, ' ', u.last_name) AS lender_name
    FROM borrow_logs bl
    LEFT JOIN items iu ON bl.item_unit_id = iu.id
    LEFT JOIN users u ON bl.lend_by = u.id
    WHERE bl.item_unit_id = $1
  `, [item_unit_id]);
  return rows;
}


async function getItemUnitLastBorrowLog(item_unit_id) {
  const { rows } = await db.query(
    "SELECT * FROM borrow_logs WHERE item_unit_id = $1 AND status='borrowed' ORDER BY borrowed_at DESC LIMIT 1",
    [item_unit_id]
  );
  return rows[0];
}

async function logBorrow(item_unit_id, borrowed_by, lend_by, purpose = null) {
  const { rows } = await db.query(
    `INSERT INTO borrow_logs (item_unit_id, borrowed_by, lend_by, purpose)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [item_unit_id, borrowed_by, lend_by, purpose]
  );
  return rows[0];
}

async function logReturn(
  id,
  returned_at = new Date(),
  status = "returned",
  remarks = null
) {
  const { rows } = await db.query(
    `UPDATE borrow_logs
     SET returned_at = $1,
         status = $2,
         remarks = $3
     WHERE id = $4
     RETURNING *`,
    [returned_at, status, remarks, id]
  );
  return rows[0];
}

export {
  getBorrowLogs,
  getItemUnitLastBorrowLog,
  getBorrowLogsByItemUnitId,
  logBorrow,
  logReturn,
};
