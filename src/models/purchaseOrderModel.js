import db from "../config/db.js";

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

export { getPurchaseOrderById, createPurchaseOrder };
