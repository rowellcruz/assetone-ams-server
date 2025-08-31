import db from "../config/db.js";

async function getRequestByData(email, asset_unit_id) {
  const { rows } = await db.query(
    `
    SELECT * 
    FROM issue_reports 
    WHERE reporter_email = $1 
      AND asset_unit_id = $2 
      AND status != 'resolved'
    `,
    [email, asset_unit_id]
  );
  return rows;
}

async function getRequestsByAssetUnit(asset_unit_id) {
  const { rows } = await db.query(
    `
    SELECT * 
    FROM issue_reports 
    WHERE asset_unit_id = $1
      AND status = 'pending'
    `,
    [asset_unit_id]
  );
  return rows;
}

async function getIssueReports() {
  const { rows } = await db.query(
    `
    SELECT DISTINCT ON (ir.asset_unit_id) 
       ir.asset_unit_id,
       ass.type,
       au.unit_tag,
       ir.status,
       ir.created_at
    FROM issue_reports ir
    JOIN assets ass ON ir.asset_id = ass.id
    JOIN asset_units au ON ir.asset_unit_id = au.id
    WHERE ir.status = 'pending'
    ORDER BY ir.asset_unit_id, ir.created_at DESC;
    `
  );
  return rows;
}

async function createRequest(data) {
  const {
    asset_id,
    asset_unit_id,
    reporter_email,
    description,
    impact,
    urgency,
  } = data;
  const { rows } = await db.query(
    "INSERT INTO issue_reports (asset_id, asset_unit_id, reporter_email, description, impact, urgency) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    [asset_id, asset_unit_id, reporter_email, description, impact, urgency]
  );
  return {
    id: rows[0].id,
    asset_id,
    asset_unit_id,
    reporter_email,
    description,
    impact,
    urgency,
  };
}

async function approveIssueReport(id, status) { 
  const query = `
    UPDATE issue_reports
    SET status = $2 WHERE asset_unit_id = $1
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id, status]);
  return rows[0];
}


export { getIssueReports, getRequestByData, getRequestsByAssetUnit, createRequest, approveIssueReport };
