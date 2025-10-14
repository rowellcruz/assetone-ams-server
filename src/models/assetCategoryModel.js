import db from "../config/db.js"; 

async function getAllAssetCategories(filters) {
  const { rows } = await db.query("SELECT * FROM asset_categories");
  return rows;
}

async function getAssetCategoryByID(id) {
  const { rows } = await db.query(
    "SELECT * FROM asset_categories WHERE id = $1;",
    [id]
  );
  return rows[0];
}

async function createAssetCategory(assetCategoryData) {
  const { name, code, created_by, updated_by } = assetCategoryData;
  const { rows } = await db.query(
    "INSERT INTO asset_categories (name, code, created_by, updated_by) VALUES ($1, $2, $3, $4) RETURNING id",
    [name, code, created_by, updated_by]
  );
  return { id: rows[0].id, ...assetCategoryData };
}

async function deleteAssetCategoriesByIDs(ids) {
  if (ids.length === 0) return;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  await db.query(
    `DELETE FROM asset_categories WHERE id IN (${placeholders})`,
    ids
  );
}

async function updateFullAssetCategory(id, assetCategoryData) {
  const { name, updated_by } = assetCategoryData;
  const { rowCount } = await db.query(
    "UPDATE asset_categories SET name = $1, updated_by = $2 WHERE id = $3",
    [name, updated_by, id]
  );
  return rowCount > 0 ? { id, ...assetCategoryData } : null;
}

async function updateAssetCategoryPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;

  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => fields[key]);

  const { rowCount } = await db.query(
    `UPDATE asset_categories SET ${updates} WHERE id = $${keys.length + 1}`,
    [...values, id]
  );

  return rowCount > 0 ? { id, ...fields } : null;
}

async function deleteAssetCategoryByID(id) {
  const { rowCount } = await db.query(
    "DELETE FROM asset_categories WHERE id = $1",
    [id]
  );
  return rowCount > 0;
}

export {
  getAllAssetCategories,
  getAssetCategoryByID,
  createAssetCategory,
  deleteAssetCategoriesByIDs,
  updateFullAssetCategory,
  updateAssetCategoryPartial,
  deleteAssetCategoryByID,
};
