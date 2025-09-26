import db from "../config/db.js";

async function getAllSubLocationAssets(filters = {}) {
  let query = "SELECT * FROM sub_location_assets";
  const conditions = [];
  const values = [];

  if (filters.locationId) {
    conditions.push(`sub_location_id = $${values.length + 1}`);
    values.push(filters.locationId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getSubLocationByID(id) {
  const { rows } = await db.query(
    `
    SELECT sl.*, l.name AS location_name
    FROM sub_locations sl
    JOIN locations l ON sl.location_id = l.id
    WHERE sl.id = $1
    `,
    [id]
  );
  return rows[0] || null;
}

async function getSubLocationAssetsByID(id) {
  const { rows } = await db.query(
    `
    SELECT 
        sa.id,
        sa.sub_location_id,
        sa.quantity,
        sa.status,
        a.id AS asset_id,
        a.type AS asset_type,
        sa.created_at,
        COUNT(au.id) AS available_units
    FROM sub_location_assets sa
    JOIN assets a 
        ON sa.asset_id = a.id
    LEFT JOIN asset_units au 
        ON sa.asset_id = au.asset_id
      AND au.sub_location_id IS NULL
    WHERE sa.sub_location_id = $1
    GROUP BY sa.id, sa.sub_location_id, sa.quantity, sa.status, a.id, a.type, sa.created_at;

    `,
    [id]
  );
  return rows;
}

async function createSubLocationAsset(data) {
  const { rows } = await db.query(
    "INSERT INTO sub_location_assets (sub_location_id, quantity, asset_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
    [data.sub_location_id, data.quantity, data.asset_id, data.status]
  );
  return rows[0];
}

async function updateSubLocationAssetPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE sub_location_assets SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getSubLocationByID(id);
}

async function deleteSubLocationAssetByID(id) {
  const { rowCount } = await db.query("DELETE FROM sub_location_assets WHERE id = $1", [id]);
  return rowCount > 0;
}

async function deleteSubLocationAssetsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM sub_location_assets WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

export {
  getAllSubLocationAssets,
  getSubLocationAssetsByID,
  createSubLocationAsset,
  updateSubLocationAssetPartial,
  deleteSubLocationAssetByID,
  deleteSubLocationAssetsByIDs,
};
