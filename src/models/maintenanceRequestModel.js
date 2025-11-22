import db from "../config/db.js";
async function getMaintenanceRequests(filters = {}) {
  let query = `
    SELECT 
      mr.item_unit_id,
      i.name AS item_name,
      i.id AS item_id,
      iu.unit_tag,
      COUNT(*) AS pending_count,
      mr.status
    FROM maintenance_requests mr
    LEFT JOIN item_units iu ON mr.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
  `;

  const conditions = [];
  const values = [];

  if (filters.departmentId) {
    conditions.push(`i.department_id = $${values.length + 1}`);
    values.push(filters.departmentId);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += `
    GROUP BY mr.item_unit_id, i.name, i.id, iu.unit_tag, mr.status
    ORDER BY mr.item_unit_id
  `;

  const { rows } = await db.query(query, values);
  return rows;
}

async function getMaintenanceRequestsByItemUnitId(id, status) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM maintenance_requests
    WHERE item_unit_id = $1
      AND status = $2
    `,
    [id, status]
  );
  return rows;
}

async function getExistingMaintenanceRequestsByData(data) {
  const { rows } = await db.query(
    `
    SELECT * FROM maintenance_requests
    WHERE requested_by = $1
      AND item_unit_id = $2
      AND status NOT IN ('resolved', 'rejected')
    `,
    [data.requested_by, data.item_unit_id]
  );
  return rows;
}

async function createMaintenanceRequest(data) {
  const { item_unit_id, requested_by, description, requestor_name } = data;

  const { rows } = await db.query(
    `INSERT INTO maintenance_requests 
      (item_unit_id, requested_by, description, requestor_name)
     VALUES ($1, $2, $3, $4)
     RETURNING id, status, requested_at, requestor_name`,
    [item_unit_id, requested_by, description, requestor_name]
  );

  return {
    id: rows[0].id,
    item_unit_id,
    requestor_name,
    requested_by,
    description,
    status: rows[0].status,
    requested_at: rows[0].requested_at,
  };
}

async function updateMaintenanceRequest(item_unit_id, status) {
  if (!item_unit_id || !status) return null;

  const query = `
    UPDATE maintenance_requests
    SET status = $2
    WHERE item_unit_id = $1 AND status = 'pending'
    RETURNING *;
  `;

  const { rows } = await db.query(query, [item_unit_id, status]);
  return rows;
}

export {
  getMaintenanceRequests,
  getMaintenanceRequestsByItemUnitId,
  getExistingMaintenanceRequestsByData,
  createMaintenanceRequest,
  updateMaintenanceRequest,
};
