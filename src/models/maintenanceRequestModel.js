import db from "../config/db.js";

async function getMaintenanceRequests() {
  const { rows } = await db.query(`
    SELECT mr.*, i.name AS item_name, iu.unit_tag, iu.serial_number
    FROM maintenance_requests mr 
    LEFT JOIN item_units iu ON mr.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id`);
  return rows;
}

async function getMaintenanceRequestsByItemUnitId(id) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM maintenance_requests
    WHERE item_unit_id = $1
      AND status = 'pending'
    `,
    [id]
  );
  return rows;
}

async function getExistingMaintenanceRequestsByData(data) {
  const { rows } = await db.query(
    `
    SELECT * FROM maintenance_requests
    WHERE requested_by = $1
      AND item_unit_id = $2
      AND status != 'resolved'
    `,
    [data.requested_by, data.item_unit_id]
  );
  return rows;
}

async function createMaintenanceRequest(data) {
  const {
    item_unit_id,
    requested_by,
    description,
    impact = 1,
    urgency = 1,
  } = data;

  const { rows } = await db.query(
    `INSERT INTO maintenance_requests 
      (item_unit_id, requested_by, description, impact, urgency)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, status, requested_at`,
    [item_unit_id, requested_by, description, impact, urgency]
  );

  return {
    id: rows[0].id,
    item_unit_id,
    requested_by,
    description,
    impact,
    urgency,
    status: rows[0].status,
    requested_at: rows[0].requested_at,
  };
}

export {
  getMaintenanceRequests,
  getMaintenanceRequestsByItemUnitId,
  getExistingMaintenanceRequestsByData,
  createMaintenanceRequest,
};
