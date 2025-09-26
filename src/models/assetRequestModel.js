import db from "../config/db.js";

async function getAssetRequests(filters = {}) {
  let query = `
    SELECT
      'asset' AS report_type,
      ar.asset_id,
      ar.sub_location_id,
      a.type AS asset_type,
      NULL AS unit_tag,
      l.name || ' - ' || sl.name AS location_display,
      COUNT(*) AS request_count,
      MAX(ar.created_at) AS last_reported_at,
      r.status
    FROM asset_requests ar
    JOIN requests r ON ar.request_id = r.id
    JOIN assets a ON ar.asset_id = a.id
    JOIN sub_locations sl ON ar.sub_location_id = sl.id
    JOIN locations l ON sl.location_id = l.id
    WHERE r.status = 'pending' AND r.request_type = 'asset'
  `;

  const conditions = [];
  const values = [];

  if (filters.subLocationId) {
    conditions.push(`ar.sub_location_id = $${values.length + 1}`);
    values.push(filters.subLocationId);
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += `
    GROUP BY ar.asset_id, a.type, ar.sub_location_id, l.name, sl.name, r.status
    ORDER BY last_reported_at DESC
  `;

  const { rows } = await db.query(query, values);
  return rows;
}

async function getAssetRequestsByLocationAndAssetId(location_id, asset_id) {
  const { rows } = await db.query(
    `
    SELECT r.*, ar.* 
    FROM asset_requests ar
    JOIN requests r ON ar.request_id = r.id
    WHERE ar.sub_location_id = $1
      AND ar.asset_id = $2
      AND r.status = 'pending'
    `,
    [location_id, asset_id]
  );
  return rows;
}

async function createAssetRequest(data) {
  const {
    request_id,
    sub_location_id,
    asset_id,
    quantity,
    requester_email,
    description,
    impact,
    urgency,
  } = data;

  const { rows } = await db.query(
    `
    INSERT INTO asset_requests (
      request_id,
      sub_location_id,
      asset_id,
      quantity,
      requester_email,
      description,
      impact,
      urgency
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      request_id,
      sub_location_id,
      asset_id,
      quantity,
      requester_email,
      description,
      impact,
      urgency,
    ]
  );

  return rows[0];
}

export {
  getAssetRequestsByLocationAndAssetId,
  getAssetRequests,
  createAssetRequest,
};
