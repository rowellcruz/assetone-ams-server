import db from "../config/db.js";

async function getPurchaseRequests(id) {
  const { rows } = await db.query(
    `
    SELECT 
        pr.*,
        a.type AS asset_type,
        COUNT(au.id) AS available_units
    FROM purchase_requests pr
    LEFT JOIN assets a 
        ON pr.asset_id = a.id
    LEFT JOIN asset_units au
        ON pr.asset_id = au.asset_id
       AND au.department_id IS NULL
    WHERE pr.department_id = $1
    GROUP BY pr.id, a.type
    `,
    [id]
  );
  return rows;
}

async function createPurchaseRequest(data) {
  const { rows } = await db.query(
    `INSERT INTO purchase_requests 
      (request_id, department_id, asset_id, requested_quantity, status, requested_by) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.request_id,
      data.department_id,
      data.asset_id,
      data.quantity,
      "pending",
      data.requested_by,
    ]
  );
  return {
    id: rows[0].id,
    request_id: data.request_id,
    asset_id: data.asset_id,
    department_id: data.department_id,
    requested_quantity: data.quantity,
    requested_by: data.requested_by,
  };
}

async function updatePurchaseRequestPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(`UPDATE purchase_requests SET ${updates} WHERE id = $${keys.length + 1}`, [
    ...values,
    id,
  ]);
  return rowCount > 0 ? { id, ...fields } : null;
}

export { getPurchaseRequests, createPurchaseRequest, updatePurchaseRequestPartial };
