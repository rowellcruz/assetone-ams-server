const db = require('../config/db');

async function getAllAssetCategories(filters) {
  const [rows] = await db.query('SELECT * FROM asset_categories');
  return rows;
}

async function getAssetCategoryByID(id) {
  const [rows] = await db.query('SELECT * FROM asset_categories WHERE id = ?;', [id]);
  return rows[0];
}

async function createAssetCategory(assetCategoryData) {
  const { name, created_by, updated_by } = assetCategoryData;
  const [result] = await db.query(
    "INSERT INTO asset_categories (name, created_by, updated_by) VALUES (?, ?, ?)",
    [name, created_by, updated_by]
  );
  return { id: result.insertId, ...assetCategoryData };
}


async function deleteAssetCategoriesByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map(() => "?").join(", ");
  await db.query(`DELETE FROM asset_categories WHERE id IN (${placeholders})`, ids);
}

async function updateFullAssetCategory(id, assetCategoryData) {
  const { name, updated_by } = userData;
  const [result] = await db.query(
    "UPDATE asset_categories SET name = ?, updated_by = ? WHERE id = ?",
    [name, updated_by]
  );
  return result.affectedRows > 0 ? { id, ...assetCategoryData } : null;
}

async function updateAssetCategoryPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => fields[key]);

  const [result] = await db.query(`UPDATE asset_categories SET ${updates} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return result.affectedRows > 0 ? { id, ...fields } : null;
}

async function deleteAssetCategoryByID(id) {
  const [result] = await db.query("DELETE FROM asset_categories WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

module.exports = {
  getAllAssetCategories, 
  getAssetCategoryByID,
  createAssetCategory,
  deleteAssetCategoriesByIDs,
  updateFullAssetCategory,
  updateAssetCategoryPartial,
  deleteAssetCategoryByID,
};