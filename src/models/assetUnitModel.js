const db = require("../config/db");

async function getAllAssetUnits(filters = {}) {
  let query = `
    SELECT 
    au.*, 
    d.name AS department_name,
    CONCAT(l.name, ' - ', sl.name) AS full_location_name,
    CONCAT(u.first_name, ' ', u.last_name) AS assigned_user_name,
    CONCAT(cu.first_name, ' ', cu.last_name) AS created_by_name,
    CONCAT(uu.first_name, ' ', uu.last_name) AS updated_by_name,
    CONCAT(du.first_name, ' ', du.last_name) AS deleted_by_name
    FROM asset_units au
    LEFT JOIN departments d ON au.department_id = d.id
    LEFT JOIN sub_locations sl ON au.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN users u ON au.assigned_user_id = u.id
    LEFT JOIN users cu ON au.created_by = cu.id
    LEFT JOIN users uu ON au.updated_by = uu.id
    LEFT JOIN users du ON au.deleted_by = du.id
`;
  const conditions = [];
  const values = [];

  if (filters.assetId) {
    conditions.push("asset_id = ?");
    values.push(filters.assetId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const [rows] = await db.execute(query, values);
  return rows;
}

async function getAssetUnitByID(id) {
  const [rows] = await db.execute("SELECT * FROM asset_units WHERE id = ?", [
    id,
  ]);
  return rows[0] || null;
}

async function createAssetUnit(data) {
  const {
    asset_id,
    brand,
    serial_number,
    unit_tag,
    sub_location_id,
    department_id,
    vendor_id,
    created_by,
    updated_by,
  } = data;

  const [result] = await db.execute(
    `INSERT INTO asset_units 
      (asset_id, brand, serial_number, unit_tag, sub_location_id, department_id, vendor_id, is_legacy, created_by, updated_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
    [
      asset_id,
      brand,
      serial_number || null,
      unit_tag || null,
      sub_location_id || null,
      department_id || null,
      vendor_id || null,
      created_by,
      updated_by,
    ]
  );

  return {
    id: result.insertId,
    asset_id,
    brand,
    serial_number,
    unit_tag,
    sub_location_id,
    department_id,
    vendor_id,
    is_legacy: 1,
    created_by,
    updated_by,
  };
}

async function updateAssetUnitPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const query = `UPDATE asset_units SET ${setClause} WHERE id = ?`;

  await db.execute(query, [...values, id]);
  return getAssetUnitByID(id);
}

async function deleteAssetUnitByID(id) {
  const [result] = await db.execute("DELETE FROM asset_units WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0;
}

async function deleteAssetUnitsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map(() => "?").join(", ");
  const [result] = await db.execute(
    `DELETE FROM asset_units WHERE id IN (${placeholders})`,
    ids
  );
  return result.affectedRows;
}

module.exports = {
  getAllAssetUnits,
  getAssetUnitByID,
  createAssetUnit,
  updateAssetUnitPartial,
  deleteAssetUnitByID,
  deleteAssetUnitsByIDs,
};
