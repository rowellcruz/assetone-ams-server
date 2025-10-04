import db from "../config/db.js";

async function getIssueReportByData(email, asset_unit_id, type) {
  const { rows } = await db.query(
    `
    SELECT r.*, ir.*
    FROM requests r
    JOIN issue_reports ir ON r.id = ir.request_id
    WHERE ir.reporter_email = $1
      AND ir.asset_unit_id = $2
      AND r.status != 'resolved'
      AND r.request_type = $3
    `,
    [email, asset_unit_id, type]
  );
  return rows;
}

async function getAssetRequestByData(email, sub_location_id, asset_id, type) {
  const { rows } = await db.query(
    `
    SELECT r.*, ar.*
    FROM requests r
    JOIN asset_requests ar ON r.id = ar.request_id
    WHERE ar.requester_email = $1
      AND ar.sub_location_id = $2
      AND ar.asset_id = $3
      AND r.status != 'resolved'
      AND r.request_type = $4
    `,
    [email, sub_location_id, asset_id, type]
  );
  return rows;
}

async function getAssetRequestByLocationId(id) {
  const { rows } = await db.query(
    `
    SELECT r.*, ar.*
    FROM requests r
    JOIN asset_requests ar ON r.id = ar.request_id
    WHERE ar.sub_location_id = $1
      AND r.status = 'approved'
      AND r.request_type = 'asset'
    `,
    [id]
  );
  return rows;
}

async function getPurchaseRequests(requested_by, asset_id, type) {
  const { rows } = await db.query(
    `
    SELECT r.*, pr.*
    FROM requests r
    JOIN purchase_requests pr ON r.id = pr.request_id
    WHERE pr.requested_by = $1
      AND pr.asset_id = $2
      AND r.request_type = $3
    `,
    [requested_by, asset_id, type]
  );
  return rows;
}

async function createRequest(type) {
  const { rows } = await db.query(
    "INSERT INTO requests (request_type) VALUES ($1) RETURNING id",
    [type]
  );
  return rows[0];
}

async function approveIssueReport(assetUnitId, status, requestType) {
  const query = `
    UPDATE requests r
    SET status = $2
    FROM issue_reports ir
    WHERE ir.asset_unit_id = $1
      AND r.id = ir.request_id
      AND r.status = 'pending'
      AND r.request_type = $3
    RETURNING r.*;
  `;
  const { rows } = await db.query(query, [assetUnitId, status, requestType]);

  return rows[0] || null;
}

async function approveAssetRequest(assetId, locationId, status, requestType) {
  const query = `
    UPDATE requests r
    SET status = $3
    FROM asset_requests ar
    WHERE ar.asset_id = $1
      AND ar.sub_location_id = $2
      AND r.id = ar.request_id
      AND r.status = 'pending'
      AND r.request_type = $4
    RETURNING r.*;
  `;
  const { rows } = await db.query(query, [
    assetId,
    locationId,
    status,
    requestType,
  ]);

  return rows[0] || null;
}

async function updateRequestPartial(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return null;
  const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = Object.values(fields);
  const { rowCount } = await db.query(`UPDATE requests SET ${updates} WHERE id = $${keys.length + 1} AND request_type = 'purchase'`, [
    ...values,
    id,
  ]);
  return rowCount > 0 ? { id, ...fields } : null;
}


export {
  getIssueReportByData,
  getAssetRequestByData,
  getAssetRequestByLocationId,
  getPurchaseRequests,
  createRequest,
  approveIssueReport,
  approveAssetRequest,
  updateRequestPartial,
};
