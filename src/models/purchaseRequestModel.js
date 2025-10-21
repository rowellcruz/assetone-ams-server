import db from "../config/db.js";

async function getPurchaseRequests() {
  const { rows } = await db.query(
    `
    SELECT pr.*, 
    c.name as item_category_name,
    (u.first_name || ' ' || u.last_name) AS requestor,
    d.name AS department_name
    FROM purchase_requests pr 
    LEFT JOIN item_categories c ON pr.item_category_id = c.id
    LEFT JOIN users u ON pr.requested_by = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    `
  );
  return rows;
}

async function getPurchaseRequestById(id) {
  const { rows } = await db.query(
    `
    SELECT pr.*, 
    c.name as item_category_name,
    (u.first_name || ' ' || u.last_name) AS requestor,
    d.name AS department_name
    FROM purchase_requests pr 
    LEFT JOIN item_categories c ON pr.item_category_id = c.id
    LEFT JOIN users u ON pr.requested_by = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    WHERE pr.id = $1
    `,
    [id]
  );
  return rows[0];
}

async function createPurchaseRequest(data) {
  const { rows } = await db.query(
    `INSERT INTO purchase_requests 
      (control_number, item_category_id, date_required, requested_by, requested_at, reason) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.control_number,
      data.item_category_id,
      data.date_required,
      data.requested_by,
      data.requested_at,
      data.reason,
    ]
  );
  return {
    id: rows[0].id,
    control_number: data.control_number,
    item_category_id: data.item_category_id,
    date_required: data.date_required,
    requested_by: data.requested_by,
    requested_at: data.requested_at,
    reason: data.reason,
  };
}

async function updatePurchaseRequestPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(
    `UPDATE purchase_requests SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );
  return rowCount > 0 ? { id, ...fields } : null;
}

export {
  getPurchaseRequests,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequestPartial,
};
