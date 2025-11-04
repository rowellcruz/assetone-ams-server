import db from "../config/db.js";

async function getPurchaseRequests(filters = {}) {
  let query = `
    SELECT pr.*, 
    c.name as item_category_name,
    (u.first_name || ' ' || u.last_name) AS requestor,
    d.name AS department_name
    FROM purchase_requests pr 
    LEFT JOIN item_categories c ON pr.item_category_id = c.id
    LEFT JOIN users u ON pr.requested_by = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    `;

  const conditions = [];
  const values = [];

  if (filters.requestorId) {
    conditions.push(`requested_by = $${values.length + 1}`);
    values.push(filters.requestorId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getPurchaseRequestCosts() {
  const query = `
    SELECT 
      SUM(pr.planned_cost) AS total_planned,
      SUM(poi.total_amount) AS total_actual
    FROM purchase_requests pr
    LEFT JOIN purchase_orders po ON po.purchase_request_id = pr.id
    LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
    WHERE pr.status != 'pending' AND pr.status != 'rework'
  `;
  const { rows } = await db.query(query);
  return rows[0] || { total_planned: 0, total_actual: 0 };
}

async function getPurchaseRequestById(id) {
  const { rows } = await db.query(
    `
    SELECT 
      pr.*,
      c.name AS item_category_name,
      (u.first_name || ' ' || u.last_name) AS requestor,
      d.id AS department_id,
      d.name AS department_name,
      po.vendor_id,
      po.status AS po_status,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', poi.id,
            'item_name', poi.item_name,
            'quantity', poi.quantity,
            'brand', poi.brand,
            'unit_price', poi.unit_price,
            'specifications', poi.specifications,
            'useful_life', poi.useful_life,
            'acquired_date', poi.acquired_date
          )
        ) FILTER (WHERE poi.id IS NOT NULL),
        '[]'
      ) AS items
    FROM purchase_requests pr
    LEFT JOIN item_categories c ON pr.item_category_id = c.id
    LEFT JOIN users u ON pr.requested_by = u.id
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN purchase_orders po ON po.purchase_request_id = pr.id
    LEFT JOIN purchase_order_items poi ON poi.purchase_order_id = po.id
    WHERE pr.id = $1
    GROUP BY pr.id, c.name, u.first_name, u.last_name, d.id, d.name, po.vendor_id, po.status
    `,
    [id]
  );
  return rows[0];
}

async function generateControlNo() {
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10).replace(/-/g, "");
  const row = await db.query(
    "SELECT seq FROM pr_sequences WHERE date_key = $1",
    [dateKey]
  );

  let seq = 1;

  if (row.rows.length > 0) {
    seq = row.rows[0].seq + 1;
    await db.query("UPDATE pr_sequences SET seq = $1 WHERE date_key = $2", [
      seq,
      dateKey,
    ]);
  } else {
    await db.query("INSERT INTO pr_sequences (date_key, seq) VALUES ($1, $2)", [
      dateKey,
      seq,
    ]);
  }

  const padded = seq.toString().padStart(4, "0");
  return `PR-${dateKey}-${padded}`;
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
  getPurchaseRequestCosts,
  generateControlNo,
  getPurchaseRequestById,
  createPurchaseRequest,
  updatePurchaseRequestPartial,
};
