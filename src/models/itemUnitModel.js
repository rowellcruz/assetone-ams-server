import db from "../config/db.js";

async function getAllItemUnits(filters = {}) {
  let query = `
    SELECT 
      iu.*, 
      d.name AS department_name,
      v.name AS vendor_name,
      v.contact_phone AS vendor_contact_number,
      v.address AS vendor_address,
      l.name || ' - ' || sl.name AS full_location_name,
      pc.first_name || ' ' || pc.last_name AS property_custodian_name,
      cu.first_name || ' ' || cu.last_name AS created_by_name,
      uu.first_name || ' ' || uu.last_name AS updated_by_name,
      du.first_name || ' ' || du.last_name AS deleted_by_name
    FROM item_units iu
    LEFT JOIN departments d ON iu.owner_department_id = d.id
    LEFT JOIN sub_locations sl ON iu.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN vendors v ON iu.vendor_id = v.id
    LEFT JOIN users pc ON pc.role = 'property_custodian' 
                      AND pc.department_id = iu.owner_department_id
    LEFT JOIN users cu ON iu.created_by = cu.id
    LEFT JOIN users uu ON iu.updated_by = uu.id
    LEFT JOIN users du ON iu.deleted_by = du.id;
  `;

  const conditions = [];
  const values = [];

  if (filters.itemId) {
    conditions.push(`item_id = $${values.length + 1}`);
    values.push(filters.itemId);
  }

  if (filters.subLocationId !== undefined) {
    if (filters.subLocationId === null) {
      conditions.push(`sub_location_id IS NULL`);
    } else {
      conditions.push(`sub_location_id = $${values.length + 1}`);
      values.push(filters.subLocationId);
    }
  }

  if (filters.departmentId !== undefined) {
    if (filters.departmentId === null) {
      conditions.push(`iu.department_id IS NULL`);
    } else {
      conditions.push(`iu.department_id = $${values.length + 1}`);
      values.push(filters.departmentId);
    }
  }

  if (filters.status !== undefined) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getItemUnitByID(id) {
  const { rows } = await db.query("SELECT * FROM item_units WHERE id = $1", [
    id,
  ]);
  return rows[0] || null;
}

async function getReportedItemDataById(id) {
  const { rows } = await db.query(
    `SELECT id, item_id, unit_tag, sub_location_id
     FROM item_units WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function getItemUnitsFromDepartment(id) {
  const { rows } = await db.query(
    `SELECT
       iu.id,
       i.type AS item_type,
       iu.unit_tag,
       iu.operational_status,
       iu.lifecycle_status
     FROM item_units iu
     JOIN items i ON iu.item_id = i.id
     WHERE iu.department_id = $1;`,
    [id]
  );
  return rows;
}

async function createItemUnit(data) {
  const {
    item_id,
    brand,
    status = "available",
    condition,
    unit_tag,
    serial_number,
    specifications,
    sub_location_id,
    is_legacy = false,
    created_by,
    updated_by,
  } = data;

  const { rows } = await db.query(
    `INSERT INTO item_units 
      (
        item_id,
        brand,
        status,
        condition,
        unit_tag,
        serial_number,
        specifications,
        sub_location_id,
        is_legacy,
        created_by,
        updated_by
      ) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING id`,
    [
      item_id,
      brand || null,
      status,
      condition,
      unit_tag || null,
      serial_number || null,
      specifications || null,
      sub_location_id || null,
      is_legacy,
      created_by,
      updated_by,
    ]
  );

  return {
    id: rows[0].id,
    item_id,
    brand,
    status,
    condition,
    unit_tag,
    serial_number,
    specifications,
    sub_location_id,
    is_legacy,
    created_by,
    updated_by,
  };
}

async function updateItemUnitPartial(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE item_units SET ${setClause} WHERE id = $${
    keys.length + 1
  }`;

  await db.query(query, [...values, id]);
  return getItemUnitByID(id);
}

async function deleteItemUnitByID(id) {
  const { rowCount } = await db.query("DELETE FROM item_units WHERE id = $1", [
    id,
  ]);
  return rowCount > 0;
}

async function deleteItemUnitsByIDs(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return 0;
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const { rowCount } = await db.query(
    `DELETE FROM item_units WHERE id IN (${placeholders})`,
    ids
  );
  return rowCount;
}

async function getLastUnitTag(prefix) {
  const { rows } = await db.query(
    `SELECT unit_tag 
     FROM item_units 
     WHERE unit_tag LIKE $1
     ORDER BY unit_tag DESC 
     LIMIT 1`,
    [`${prefix}-%`]
  );
  return rows[0];
}

export {
  getAllItemUnits,
  getItemUnitByID,
  getReportedItemDataById,
  getItemUnitsFromDepartment,
  getLastUnitTag,
  createItemUnit,
  updateItemUnitPartial,
  deleteItemUnitByID,
  deleteItemUnitsByIDs,
};
