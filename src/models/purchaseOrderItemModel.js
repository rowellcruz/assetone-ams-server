import db from "../config/db.js";

async function createPurchaseOrderItem(data) {
  const { rows } = await db.query(
    `INSERT INTO purchase_order_items 
      (purchase_order_id, brand, item_name, quantity, unit_price, specifications) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [
      data.purchase_order_id,
      data.brand,
      data.item_name,
      data.quantity,
      data.unit_price,
      data.specifications,
    ]
  );
  return {
    id: rows[0].id,
    purchase_order_id: data.purchase_order_id,
    brand: data.brand,
    item_name: data.item_name,
    quantity: data.quantity,
    unit_price: data.unit_price,
    specifications: data.specifications,
  };
}

async function updatePOItemPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(
    `UPDATE purchase_order_items SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );
  return rowCount > 0 ? { id, ...fields } : null;
}


export { createPurchaseOrderItem, updatePOItemPartial };
