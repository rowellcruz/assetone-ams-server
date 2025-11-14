import db from "../config/db.js";

async function getRelocationLog(filters = {}) {
  let query = `
    SELECT 
      rl.*,
      iu.unit_tag AS unit_tag,
      i.name AS item_name,
      CONCAT(from_loc.name, ' - ', from_sl.name) AS from_full_location_name,
      CONCAT(to_loc.name, ' - ', to_sl.name) AS to_full_location_name,
      d.name AS department_name
    FROM relocation_log rl
    LEFT JOIN item_units iu ON rl.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON rl.for_department = d.id
    LEFT JOIN sub_locations from_sl ON rl.from_sub_location_id = from_sl.id
    LEFT JOIN sub_locations to_sl ON rl.to_sub_location_id = to_sl.id
    LEFT JOIN locations from_loc ON from_sl.location_id = from_loc.id
    LEFT JOIN locations to_loc ON to_sl.location_id = to_loc.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId) {
    conditions.push(`rl.for_department = $${values.length + 1}`);
    values.push(filters.departmentId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  const { rows } = await db.query(query, values);
  return rows;
}

async function getRelocationLogByID(id) {
  const query = `
    SELECT * FROM relocation_log WHERE id = $1 
  `;

  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
}


async function getRelocationLogByTechnicianId(technicianId) {
  const query = `
    SELECT 
      rl.*,
      rl.item_unit_id as item_unit_id,
      iu.unit_tag AS unit_tag,
      i.name AS item_name,
      CONCAT(from_loc.name, ' - ', from_sl.name) AS from_full_location_name,
      CONCAT(to_loc.name, ' - ', to_sl.name) AS to_full_location_name,
      d.name AS department_name,
      rt.id AS technician_assignment_id,
      rt.user_id AS technician_id
    FROM relocation_technicians rt
    LEFT JOIN relocation_log rl ON rt.relocation_log_id = rl.id
    LEFT JOIN item_units iu ON rl.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
    LEFT JOIN departments d ON rl.for_department = d.id
    LEFT JOIN sub_locations from_sl ON rl.from_sub_location_id = from_sl.id
    LEFT JOIN sub_locations to_sl ON rl.to_sub_location_id = to_sl.id
    LEFT JOIN locations from_loc ON from_sl.location_id = from_loc.id
    LEFT JOIN locations to_loc ON to_sl.location_id = to_loc.id
    WHERE rt.user_id = $1
  `;

  const { rows } = await db.query(query, [technicianId]);
  return rows;
}

async function assignRelocationTask(logId, userId) {
  const { rows } = await db.query(
    `INSERT INTO relocation_technicians (relocation_log_id, user_id)
     VALUES ($1, $2)
     RETURNING id`,
    [logId, userId]
  );
  return {
    id: rows[0].id,
    logId,
    userId,
  };
}

async function updateRelocationLog(id, fieldsToUpdate) {
  const keys = Object.keys(fieldsToUpdate);
  const values = Object.values(fieldsToUpdate);

  if (keys.length === 0) return null;

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const query = `UPDATE relocation_log SET ${setClause} WHERE id = $${
    keys.length + 1
  } RETURNING *`;

  const { rows } = await db.query(query, [...values, id]);
  return rows[0] || null;
}

export { getRelocationLog, getRelocationLogByTechnicianId, getRelocationLogByID, assignRelocationTask, updateRelocationLog };
