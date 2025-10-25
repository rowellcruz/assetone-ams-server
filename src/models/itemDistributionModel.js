import db from "../config/db.js";

async function getItemsForDistribution({ receivedOnly = false } = {}) {
  let query = "SELECT * FROM items_for_distribution";
  const params = [];

  if (receivedOnly) {
    query += " WHERE received_at IS NOT NULL";
  }

  const { rows } = await db.query(query, params);
  return rows;
}

async function getItemForDistributionByPRId(id, { remainingOnly = false } = {}) {
  let query = `
    SELECT ifd.*, i.name, iu.unit_tag, iu.serial_number, ifd.received_at
    FROM items_for_distribution ifd
    LEFT JOIN item_units iu ON ifd.item_unit_id = iu.id
    LEFT JOIN items i ON iu.item_id = i.id
    WHERE ifd.purchase_request_id = $1
  `;
  const params = [id];

  if (remainingOnly) {
    query += " AND ifd.received_at IS NULL";
  }

  const { rows } = await db.query(query, params);
  return rows;
}

async function createItemForDistribution(data) {
  const { rows } = await db.query(
    `INSERT INTO items_for_distribution 
      (purchase_request_id, item_unit_id, received_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [data.purchase_request_id, data.item_unit_id, data.received_at || null]
  );

  return {
    id: rows[0].id,
    purchase_request_id: data.purchase_request_id,
    item_unit_id: data.item_unit_id,
    received_at: data.received_at || null,
  };
}

async function markAsReceived(id, receivedAt = new Date()) {
  const { rowCount } = await db.query(
    `UPDATE items_for_distribution
     SET received_at = $1
     WHERE id = $2`,
    [receivedAt, id]
  );

  return rowCount > 0 ? { id, received_at: receivedAt } : null;
}

export { getItemsForDistribution, getItemForDistributionByPRId, createItemForDistribution, markAsReceived };
