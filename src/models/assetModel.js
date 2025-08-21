const db = require("../config/db");

async function getAllAssets(filters = {}) {
  let query = `
    SELECT a.*, c.name AS category_name
    FROM assets a
    LEFT JOIN asset_categories c ON a.category_id = c.id
  `;

  const conditions = [];
  const values = [];

  if (filters.categoryId) {
    conditions.push("category_id = ?");
    values.push(filters.categoryId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.execute(query, values);
  return rows;
}

async function getAssetByID(id) {
  const [rows] = await db.execute("SELECT * FROM assets WHERE id = ?", [id]);
  return rows[0] || null;
}

async function createAsset(data) {
  const { type, category_id, created_by, updated_by } = data;
  const [result] = await db.execute(
    "INSERT INTO assets (type, category_id, created_by, updated_by) VALUES (?, ?, ?, ?)",
    [type, category_id, created_by, updated_by]
  );
  return { id: result.insertId, type, category_id, created_by, updated_by };
}

async function updateAssetPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE assets SET ${setClause} WHERE id = ?`;

  await db.execute(query, [...values, id]);
  return getAssetByID(id);
}

async function deleteAssetByID(id) {
  const [result] = await db.execute("DELETE FROM assets WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

async function deleteAssetsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(", ");
  const [result] = await db.execute(`DELETE FROM assets WHERE id IN (${placeholders})`, ids);
  return result.affectedRows;
}

module.exports = {
  getAllAssets,
  getAssetByID,
  createAsset,
  updateAssetPartial,
  deleteAssetByID,
  deleteAssetsByIDs,
};
