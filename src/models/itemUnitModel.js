import db from "../config/db.js";

async function getAllItemUnits(filters = {}) {
  let query = `
    SELECT 
      iu.*, 
      i.name AS item_name,
      d.name AS department_name,
      v.name AS vendor_name,
      v.contact_phone AS vendor_contact_number,
      v.address AS vendor_address,
      l.name || ' - ' || sl.name AS full_location_name,
      l.name AS location_name,
      sl.name AS sub_location_name,
      pc.first_name || ' ' || pc.last_name AS property_custodian_name,
      cu.first_name || ' ' || cu.last_name AS created_by_name,
      uu.first_name || ' ' || uu.last_name AS updated_by_name,
      du.first_name || ' ' || du.last_name AS deleted_by_name,
      i.useful_life,
      -- Calculate remaining useful life
      CASE 
        WHEN iu.purchase_date IS NOT NULL AND i.useful_life IS NOT NULL THEN
          GREATEST(
            0, 
            i.useful_life - EXTRACT(YEAR FROM AGE(CURRENT_DATE, iu.purchase_date))
          )
        ELSE NULL
      END AS remaining_useful_life,
      -- Calculate remaining value (purchase cost spread over remaining useful life)
      CASE 
        WHEN iu.purchase_cost IS NOT NULL 
             AND iu.purchase_date IS NOT NULL 
             AND i.useful_life IS NOT NULL 
             AND i.useful_life > 0 THEN
          ROUND(
            iu.purchase_cost * 
            GREATEST(0, i.useful_life - EXTRACT(YEAR FROM AGE(CURRENT_DATE, iu.purchase_date))) / 
            i.useful_life,
            2
          )
        ELSE iu.purchase_cost -- Return original cost if can't calculate depreciation
      END AS remaining_value
    FROM item_units iu
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON iu.owner_department_id = d.id
    LEFT JOIN sub_locations sl ON iu.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN vendors v ON iu.vendor_id = v.id
    LEFT JOIN users pc ON pc.role = 'property_custodian' 
                      AND pc.department_id = iu.owner_department_id
    LEFT JOIN users cu ON iu.created_by = cu.id
    LEFT JOIN users uu ON iu.updated_by = uu.id
    LEFT JOIN users du ON iu.deleted_by = du.id
  `;

  const conditions = [];
  const values = [];

  if (filters.itemId) {
    conditions.push(`iu.item_id = $${values.length + 1}`);
    values.push(filters.itemId);
  }

  if (filters.ownerDepartmentId) {
    conditions.push(`iu.owner_department_id = $${values.length + 1}`);
    values.push(filters.ownerDepartmentId);
  }

  if (filters.subLocationId !== undefined) {
    if (filters.subLocationId === null) {
      conditions.push(`iu.sub_location_id IS NULL`);
    } else {
      conditions.push(`iu.sub_location_id = $${values.length + 1}`);
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
    conditions.push(`iu.status = $${values.length + 1}`);
    values.push(filters.status);
  }

  if (filters.unitsForMaintenance === true) {
    conditions.push(`(iu.status = 'available' OR iu.status = 'in_use')`);
  }

  if (filters.technicianDepartmentId !== undefined) {
    conditions.push(`i.department_id = $${values.length + 1}`);
    values.push(filters.technicianDepartmentId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getItemUnitByID(id) {
  const { rows } = await db.query(
    `
    SELECT 
      iu.*, 
      i.name AS item_name,
      i.department_id AS item_department_id,
      d.name AS department_name,
      v.name AS vendor_name,
      v.contact_phone AS vendor_contact_number,
      v.address AS vendor_address,
      l.name || ' - ' || sl.name AS full_location_name,
      l.name AS location_name,
      sl.name AS sub_location_name,
      pc.first_name || ' ' || pc.last_name AS property_custodian_name,
      cu.first_name || ' ' || cu.last_name AS created_by_name,
      uu.first_name || ' ' || uu.last_name AS updated_by_name,
      du.first_name || ' ' || du.last_name AS deleted_by_name,
      i.useful_life,
      -- Calculate remaining useful life
      CASE 
        WHEN iu.purchase_date IS NOT NULL AND i.useful_life IS NOT NULL THEN
          GREATEST(
            0, 
            i.useful_life - EXTRACT(YEAR FROM AGE(CURRENT_DATE, iu.purchase_date))
          )
        ELSE NULL
      END AS remaining_useful_life,
      -- Relocation info
      rl.id AS relocation_log_id,
      rl.status AS relocation_status,
      rl.requested_at AS relocation_created_at,
      rl.from_sub_location_id,
      rl.to_sub_location_id,
      rl.from_location_name,
      rl.from_sub_location_name,
      rl.to_location_name,
      rl.to_sub_location_name
    FROM item_units iu
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON iu.owner_department_id = d.id
    LEFT JOIN sub_locations sl ON iu.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN vendors v ON iu.vendor_id = v.id
    LEFT JOIN users pc ON pc.role = 'property_custodian' 
                      AND pc.department_id = iu.owner_department_id
    LEFT JOIN users cu ON iu.created_by = cu.id
    LEFT JOIN users uu ON iu.updated_by = uu.id
    LEFT JOIN users du ON iu.deleted_by = du.id
    LEFT JOIN LATERAL (
      SELECT 
        r.id,
        r.status,
        r.requested_at,
        r.from_sub_location_id,
        r.to_sub_location_id,
        from_sl.name AS from_sub_location_name,
        from_l.name AS from_location_name,
        to_sl.name AS to_sub_location_name,
        to_l.name AS to_location_name
      FROM relocation_log r
      LEFT JOIN sub_locations from_sl ON r.from_sub_location_id = from_sl.id
      LEFT JOIN locations from_l ON from_sl.location_id = from_l.id
      LEFT JOIN sub_locations to_sl ON r.to_sub_location_id = to_sl.id
      LEFT JOIN locations to_l ON to_sl.location_id = to_l.id
      WHERE r.item_unit_id = iu.id
        AND r.status IN ('pending','in_progress')
      ORDER BY r.requested_at DESC
      LIMIT 1
    ) rl ON TRUE
    WHERE iu.id = $1

    `,
    [id]
  );

  return rows[0] || null;
}

async function getItemByItemUnitId(id) {
  const { rows } = await db.query(
    `
    SELECT i.*,
    CASE 
      WHEN iu.purchase_date IS NOT NULL AND i.useful_life IS NOT NULL THEN
        GREATEST(
          0, 
          i.useful_life - EXTRACT(YEAR FROM AGE(CURRENT_DATE, iu.purchase_date))
        )
      ELSE NULL
    END AS remaining_useful_life
    FROM item_units iu
    JOIN items i ON iu.item_id = i.id
    WHERE iu.id = $1
    `,
    [id]
  );

  return rows[0] || null;
}


async function getItemUnitsByIds(ids) {
  if (!ids || ids.length === 0) return [];

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(",");

  const { rows } = await db.query(
    `
    SELECT 
      iu.id,
      iu.unit_tag,
      i.name AS item_name,
      iu.brand,
      d.name AS department_name,
      l.name || ' - ' || sl.name AS full_location_name,
      l.name AS location_name,
      sl.name AS sub_location_name,
      -- Relocation info
      rl.id AS relocation_log_id,
      rl.status AS relocation_status,
      rl.from_location_name AS relocation_from_location_name,
      rl.from_sub_location_name AS relocation_from_sub_location_name,
      rl.to_location_name AS relocation_to_location_name,
      rl.to_sub_location_name AS relocation_to_sub_location_name,
      CASE WHEN rl.status IS NOT NULL THEN 'under_relocation' ELSE 'available' END AS status
    FROM item_units iu
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON iu.owner_department_id = d.id
    LEFT JOIN sub_locations sl ON iu.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN LATERAL (
      SELECT 
        rl.id,
        rl.status,
        rl.requested_at,
        from_l.name AS from_location_name,
        from_sl.name AS from_sub_location_name,
        to_l.name AS to_location_name,
        to_sl.name AS to_sub_location_name
      FROM relocation_log rl
      LEFT JOIN sub_locations from_sl ON rl.from_sub_location_id = from_sl.id
      LEFT JOIN locations from_l ON from_sl.location_id = from_l.id
      LEFT JOIN sub_locations to_sl ON rl.to_sub_location_id = to_sl.id
      LEFT JOIN locations to_l ON to_sl.location_id = to_l.id
      WHERE rl.item_unit_id = iu.id
        AND rl.status IN ('pending', 'in_progress')
      ORDER BY rl.requested_at DESC
      LIMIT 1
    ) rl ON TRUE
    WHERE iu.id IN (${placeholders})
    `,
    ids
  );

  return rows;
}

async function getItemUnitsByDepartmentId(departmentId) {
  const { rows } = await db.query(
    `
    SELECT 
      iu.id,
      iu.unit_tag,
      i.name AS item_name,
      iu.brand,
      d.name AS department_name,
      l.name || ' - ' || sl.name AS full_location_name,
      l.name AS location_name,
      sl.name AS sub_location_name,
      rl.id AS relocation_log_id,
      rl.status AS relocation_status,
      rl.requested_at AS relocation_created_at,
      rl.from_location_name AS relocation_from_location_name,
      rl.from_sub_location_name AS relocation_from_sub_location_name,
      rl.to_location_name AS relocation_to_location_name,
      rl.to_sub_location_name AS relocation_to_sub_location_name,
      CASE WHEN rl.status IS NOT NULL THEN 'under_relocation' ELSE 'available' END AS status
    FROM item_units iu
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON iu.owner_department_id = d.id
    LEFT JOIN sub_locations sl ON iu.sub_location_id = sl.id
    LEFT JOIN locations l ON sl.location_id = l.id
    LEFT JOIN LATERAL (
      SELECT 
        r.id,
        r.status,
        r.created_at,
        from_l.name AS from_location_name,
        from_sl.name AS from_sub_location_name,
        to_l.name AS to_location_name,
        to_sl.name AS to_sub_location_name
      FROM relocation_log r
      LEFT JOIN sub_locations from_sl ON r.from_sub_location_id = from_sl.id
      LEFT JOIN locations from_l ON from_sl.location_id = from_l.id
      LEFT JOIN sub_locations to_sl ON r.to_sub_location_id = to_sl.id
      LEFT JOIN locations to_l ON to_sl.location_id = to_l.id
      WHERE r.item_unit_id = iu.id
        AND r.status IN ('pending', 'in_progress')
      ORDER BY r.created_at DESC
      LIMIT 1
    ) rl ON TRUE
    WHERE iu.owner_department_id = $1
    `,
    [departmentId]
  );

  return rows;
}

async function getReportedItemDataById(id) {
  const { rows } = await db.query(
    `SELECT iu.id, iu.item_id, iu.unit_tag, iu.sub_location_id, i.name as item_name
     FROM item_units iu
     LEFT JOIN items i ON iu.item_id = i.id
     WHERE iu.id = $1`,
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

async function getConditionCounts() {
  const query = `
    SELECT
      CASE 
        WHEN condition BETWEEN 91 AND 100 THEN 'Excellent'
        WHEN condition BETWEEN 76 AND 90  THEN 'Very Good'
        WHEN condition BETWEEN 61 AND 75  THEN 'Good'
        WHEN condition BETWEEN 46 AND 60  THEN 'Average'
        WHEN condition BETWEEN 31 AND 45  THEN 'Fair'
        WHEN condition BETWEEN 1  AND 30  THEN 'Poor'
      END AS condition,
      COUNT(*) AS value
    FROM item_units
    GROUP BY condition
    ORDER BY value DESC;

  `;
  const { rows } = await db.query(query);
  return rows;
}

async function getMaintenanceLoad() {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE status = 'under_maintenance') AS under_maintenance,
      COUNT(*) AS total_assets
    FROM item_units;
  `;
  const { rows } = await db.query(query);
  return rows[0];
}

async function getUtilization() {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE status IN ('in_use', 'borrowed')) AS utilized_assets,
      COUNT(*) AS total_assets
    FROM item_units;
  `;
  const { rows } = await db.query(query);
  return rows[0];
}

async function createItemUnit(data) {
  const {
    item_id,
    brand,
    status,
    condition = 100,
    unit_tag,
    serial_number,
    specifications,
    sub_location_id,
    owner_department_id,
    purchase_date,
    purchase_cost,
    is_legacy = false,
    vendor_id,
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
        owner_department_id,
        purchase_date,
        purchase_cost,
        is_legacy,
        vendor_id,
        created_by,
        updated_by
      ) 
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
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
      owner_department_id,
      purchase_date,
      purchase_cost,
      is_legacy,
      vendor_id,
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
    owner_department_id,
    purchase_date,
    purchase_cost,
    is_legacy,
    vendor_id,
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
  getItemUnitsByDepartmentId,
  getItemByItemUnitId,
  getReportedItemDataById,
  getItemUnitsByIds,
  getConditionCounts,
  getMaintenanceLoad,
  getUtilization,
  getItemUnitsFromDepartment,
  getLastUnitTag,
  createItemUnit,
  updateItemUnitPartial,
  deleteItemUnitByID,
  deleteItemUnitsByIDs,
};
