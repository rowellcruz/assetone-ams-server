import db from "../config/db.js";

async function getAllItemCategories() {
  const { rows } = await db.query("SELECT * FROM item_categories");
  return rows;
}

async function getItemCategoryByID(id) {
  const { rows } = await db.query(
    "SELECT * FROM item_categories WHERE id = $1",
    [id]
  );
  return rows[0];
}

async function createItemCategory(itemCategoryData) {
  const { name, code, created_by, updated_by } = itemCategoryData;
  const { rows } = await db.query(
    "INSERT INTO item_categories (name, code, created_by, updated_by) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, code, created_by, updated_by]
  );
  return { id: rows[0].id, ...itemCategoryData };
}

async function deleteItemCategoriesByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(
    `DELETE FROM item_categories WHERE id IN (${placeholders})`,
    ids
  );
}

async function updateItemCategoryPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => fields[key]);

  const { rowCount } = await db.query(
    `UPDATE item_categories SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );

  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteItemCategoryByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM item_categories WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export {
  getAllItemCategories,
  getItemCategoryByID,
  createItemCategory,
  deleteItemCategoriesByIDs,
  updateItemCategoryPartial,
  deleteItemCategoryByID,
};
