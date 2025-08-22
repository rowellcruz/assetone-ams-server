import db from "../config/db.js";

async function getAllAssets(filters = {}) {
  let query = `
    SELECT a.*, c.name AS category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.id
  `;

  const conditions = [];
  const values = [];

  if (filters.categoryId) {
    conditions.push("a.category_id = $1");
    values.push(filters.categoryId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getAssetByID(id) {
  const { rows } = await db.query("SELECT * FROM assets WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createAsset(data) {
  const { type, category_id, created_by, updated_by } = data;
  const { rows } = await db.query(
    "INSERT INTO assets (type, category_id, created_by, updated_by) VALUES ($1, $2, $3, $4) RETURNING id",
    [type, category_id, created_by, updated_by]
  );
  return { id: rows[0].id, type, category_id, created_by, updated_by };
}

async function updateAssetPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE assets SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getAssetByID(id);
}

async function deleteAssetByID(id) {
  const { rowCount } = await db.query("DELETE FROM assets WHERE id = $1", [id]);
  return rowCount > 0;
}

async function deleteAssetsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(`DELETE FROM assets WHERE id IN (${placeholders})`, ids);
  return rowCount;
}

export {
  getAllAssets,
  getAssetByID,
  createAsset,
  updateAssetPartial,
  deleteAssetByID,
  deleteAssetsByIDs,
};
