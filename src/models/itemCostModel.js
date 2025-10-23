import db from "../config/db.js";

async function getAllItemCost() {
  const { rows } = await db.query("SELECT * FROM item_costs");
  return rows;
}

async function getItemCostByID(id) {
  const { rows } = await db.query(
    "SELECT * FROM item_costs WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createItemCost(itemCostData) {
  const { item_unit_id, purchase_price } = itemCostData;
  const { rows } = await db.query(
    "INSERT INTO item_costs (item_unit_id, purchase_price) VALUES ($1, $2) RETURNING id",
    [item_unit_id, purchase_price]
  );
  return { id: rows[0].id, ...itemCostData };
}

async function deleteItemCostByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(
    `DELETE FROM item_costs WHERE id IN (${placeholders})`,
    ids
  );
}

async function updateItemCostPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => fields[key]);

  const { rowCount } = await db.query(
    `UPDATE item_costs SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );

  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteItemCostByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM item_costs WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export {
  getAllItemCost,
  getItemCostByID,
  createItemCost,
  deleteItemCostByIDs,
  updateItemCostPartial,
  deleteItemCostByID,
};
