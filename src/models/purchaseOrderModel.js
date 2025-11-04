import db from "../config/db.js";

async function getLeadTimeRows() {
  const { rows } = await db.query(`
    SELECT
      EXTRACT(DAY FROM (po.delivered_at - pr.requested_at)) AS lead_time_days,
      DATE_TRUNC('month', po.delivered_at) AS delivery_month
    FROM purchase_orders po
    JOIN purchase_requests pr ON po.purchase_request_id = pr.id
    WHERE po.delivered_at IS NOT NULL
    ORDER BY DATE_TRUNC('month', po.delivered_at) ASC;
  `);
  return rows;
}

async function getPurchaseOrders() {
  const { rows } = await db.query(`
    SELECT 
      po.*, 
      pr.status, 
      pr.requested_at 
    FROM purchase_orders po 
    LEFT JOIN purchase_requests pr 
      ON po.purchase_request_id = pr.id
  `);
  return rows;
}

async function getPurchaseOrderById(id) {
  const { rows } = await db.query(
    "SELECT * FROM purchase_orders WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createPurchaseOrder(data) {
  const { rows } = await db.query(
    `INSERT INTO purchase_orders 
      (purchase_request_id, vendor_id) 
     VALUES ($1, $2) 
     RETURNING *`,
    [
      data.purchase_request_id,
      data.vendor_id,
    ]
  );
  return {
    id: rows[0].id,
    purchase_request_id: data.purchase_request_id,
    vendor_id: data.vendor_id,
  };
}

async function updatePurchaseOrderByPRId(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(
    `UPDATE purchase_orders SET ${updates} WHERE purchase_request_id = $${keys.length + 1}`,
    [...values, id]
  );
  return rowCount > 0 ? { id, ...fields } : null;
}


export { getLeadTimeRows, getPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrderByPRId };
