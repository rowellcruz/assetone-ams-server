import db from "../config/db.js";

async function getAllItemDepreciation() {
  const { rows } = await db.query("SELECT * FROM item_lifecycle");
  return rows;
}

async function getItemDepreciationByID(id) {
  const { rows } = await db.query(
    "SELECT * FROM item_lifecycle WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createItemDepreciation(itemDepreciationData) {
  const { item_unit_id, useful_life, method, purchase_date, rate } = itemDepreciationData;
  const { rows } = await db.query(
    "INSERT INTO item_lifecycle (item_unit_id, useful_life, method, purchase_date, rate) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [item_unit_id, useful_life, method, purchase_date, rate]
  );
  return { id: rows[0].id, ...itemDepreciationData };
}

async function deleteItemDepreciationByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(
    `DELETE FROM item_lifecycle WHERE id IN (${placeholders})`,
    ids
  );
}

async function updateItemDepreciationPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => fields[key]);

  const { rowCount } = await db.query(
    `UPDATE item_lifecycle SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );

  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteItemDepreciationByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM item_lifecycle WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export {
  getAllItemDepreciation,
  getItemDepreciationByID,
  createItemDepreciation,
  deleteItemDepreciationByIDs,
  updateItemDepreciationPartial,
  deleteItemDepreciationByID,
};
