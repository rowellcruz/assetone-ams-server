import db from "../config/db.js";

async function getRequestedItemsByRequestId(id) {
  const { rows } = await db.query(
    "SELECT * FROM requested_items WHERE purchase_request_id = $1",
    [id]
  );
  return rows;
}

async function createRequestedItems(data) {
  const { rows } = await db.query(
    `INSERT INTO requested_items 
      (purchase_request_id, item_description, quantity) 
     VALUES ($1, $2, $3) 
     RETURNING *`,
    [data.purchase_request_id, data.item_description, data.quantity]
  );
  return {
    id: rows[0].id,
    purchase_request_id: data.purchase_request_id,
    item_description: data.item_description,
    quantity: data.quantity,
  };
}

export { getRequestedItemsByRequestId, createRequestedItems };
