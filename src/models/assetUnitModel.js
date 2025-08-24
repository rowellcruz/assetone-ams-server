import db from "../config/db.js";

async function getAllAssetUnits(filters = {}) {
  let query = `
    SELECT 
      au.*, 
      d.name AS department_name,
      l.name || ' - ' || sl.name AS full_location_name,
      u.first_name || ' ' || u.last_name AS assigned_user_name,
      cu.first_name || ' ' || cu.last_name AS created_by_name,
      uu.first_name || ' ' || uu.last_name AS updated_by_name,
      du.first_name || ' ' || du.last_name AS deleted_by_name
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
    conditions.push(`asset_id = $1`);
    values.push(filters.assetId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getAssetUnitByID(id) {
  const { rows } = await db.query("SELECT * FROM asset_units WHERE id = $1", [id]);
  return rows[0] || null;
}

async function createAssetUnit(data) {
  const {
    asset_id,
    brand,
    lifecycle_status,
    operational_status,
    condition,
    unit_tag,
    serial_number,
    acquisition_cost,
    useful_life_years,
    depreciation_method,
    depreciation_rate,
    acquisition_date,
    department_id,
    sub_location_id,
    vendor_id,
    assigned_user_id,
    is_legacy,
    created_by,
    updated_by,
  } = data;

  const { rows } = await db.query(
    `INSERT INTO asset_units 
      (
        asset_id,
        brand,
        lifecycle_status,
        operational_status,
        condition,
        unit_tag,
        serial_number,
        acquisition_cost,
        useful_life_years,
        depreciation_method,
        depreciation_rate,
        acquisition_date,
        department_id,
        sub_location_id,
        vendor_id,
        assigned_user_id,
        is_legacy,
        created_by,
        updated_by
      ) 
     VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      ) 
     RETURNING id`,
    [
      asset_id,
      brand || null,
      lifecycle_status || 'active',
      operational_status || 'available',
      condition,
      unit_tag || null,
      serial_number || null,
      acquisition_cost || 0.0,
      useful_life_years || 0,
      depreciation_method || null,
      depreciation_rate,
      acquisition_date || null,
      department_id || null,
      sub_location_id || null,
      vendor_id || null,
      assigned_user_id || null,
      is_legacy ?? false,
      created_by,
      updated_by,
    ]
  );

  return {
    id: rows[0].id,
    asset_id,
    brand,
    lifecycle_status: lifecycle_status || 'active',
    operational_status: operational_status || 'available',
    condition,
    unit_tag,
    serial_number,
    acquisition_cost: acquisition_cost || 0.0,
    useful_life_years: useful_life_years || 0,
    depreciation_method,
    depreciation_rate,
    acquisition_date,
    department_id,
    sub_location_id,
    vendor_id,
    assigned_user_id,
    is_legacy: is_legacy ?? false,
    created_by,
    updated_by,
  };
}

async function updateAssetUnitPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE asset_units SET ${setClause} WHERE id = $${keys.length + 1}`;

  await db.query(query, [...values, id]);
  return getAssetUnitByID(id);
}

async function deleteAssetUnitByID(id) {
  const { rowCount } = await db.query("DELETE FROM asset_units WHERE id = $1", [id]);
  return rowCount > 0;
}

async function deleteAssetUnitsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(`DELETE FROM asset_units WHERE id IN (${placeholders})`, ids);
  return rowCount;
}

export {
  getAllAssetUnits,
  getAssetUnitByID,
  createAssetUnit,
  updateAssetUnitPartial,
  deleteAssetUnitByID,
  deleteAssetUnitsByIDs,
};
