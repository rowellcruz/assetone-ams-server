import db from "../config/db.js";

async function getBorrowLogs(filters = {}) {
  let query = `
    SELECT 
      bl.*,
      i.name as item_name,
      iu.unit_tag AS item_unit_tag,
      CONCAT(u.first_name, ' ', u.last_name) AS lender_name,
      CASE
          WHEN bl.returned_at IS NOT NULL AND bl.returned_at > bl.due_date THEN true
          WHEN bl.returned_at IS NULL AND NOW() > bl.due_date THEN true
          ELSE false
      END AS is_overdue
    FROM borrow_logs bl
    LEFT JOIN item_units iu ON bl.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN users u ON bl.lend_by = u.id
  `;

  const conditions = [];
  const values = [];

  if (filters.custodianId) {
    conditions.push(`iu.owner_department_id = $${values.length + 1}`);
    values.push(filters.custodianId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getBorrowLogsByItemUnitId(item_unit_id) {
  const { rows } = await db.query(
    `
    SELECT 
      bl.*,
      iu.name AS item_name,
      CONCAT(u.first_name, ' ', u.last_name) AS lender_name
    FROM borrow_logs bl
    LEFT JOIN items iu ON bl.item_unit_id = iu.id
    LEFT JOIN users u ON bl.lend_by = u.id
    WHERE bl.item_unit_id = $1
  `,
    [item_unit_id]
  );
  return rows;
}
async function getMostBorrowedAssets() {
  const query = `
    SELECT 
      i.name AS item_name,
      COUNT(*) AS borrow_count
    FROM borrow_logs bl
    LEFT JOIN item_units iu ON bl.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
    GROUP BY i.name
    ORDER BY borrow_count DESC
    LIMIT 5;
  `;

  const { rows } = await db.query(query);
  return rows;
}


async function getItemUnitLastBorrowLog(item_unit_id) {
  const { rows } = await db.query(
    "SELECT * FROM borrow_logs WHERE item_unit_id = $1 AND status='borrowed' ORDER BY borrowed_at DESC LIMIT 1",
    [item_unit_id]
  );
  return rows[0];
}

async function logBorrow(
  item_unit_id,
  borrowed_by,
  lend_by,
  purpose = null,
  due_date
) {
  const { rows } = await db.query(
    `INSERT INTO borrow_logs (item_unit_id, borrowed_by, lend_by, purpose, due_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [item_unit_id, borrowed_by, lend_by, purpose, due_date]
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
  getMostBorrowedAssets,
  logBorrow,
  logReturn,
};
