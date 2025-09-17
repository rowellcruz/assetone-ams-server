import db from "../config/db.js";

async function getIssueReports() {
  const { rows } = await db.query(`
    SELECT 
      'issue' AS report_type,
      ir.asset_id,
      ir.asset_unit_id,
      a.type AS asset_type,
      au.unit_tag,
      NULL AS location_display,
      COUNT(*) AS request_count,
      MAX(r.created_at) AS last_reported_at,
      r.status
    FROM issue_reports ir
    JOIN requests r ON ir.request_id = r.id
    JOIN assets a ON ir.asset_id = a.id
    JOIN asset_units au ON ir.asset_unit_id = au.id
    WHERE r.status = 'pending' AND r.request_type = 'issue'
    GROUP BY ir.asset_id, ir.asset_unit_id, a.type, au.unit_tag, r.status
    ORDER BY last_reported_at DESC;
  `);
  return rows;
}

async function getReportsAsMaintenanceRequest() {
  const { rows } = await db.query(
    `
    SELECT 
      r.*, 
      ir.*, 
      a.type AS asset_type, 
      au.unit_tag
    FROM issue_reports ir
    JOIN requests r ON ir.request_id = r.id
    JOIN assets a ON ir.asset_id = a.id
    JOIN asset_units au ON ir.asset_unit_id = au.id
    WHERE r.request_type = 'maintenance'
    ORDER BY 
      CASE r.status
        WHEN 'pending' THEN 1
        WHEN 'in_progress' THEN 2
        WHEN 'resolved' THEN 3
        ELSE 4
      END,
      r.created_at DESC
    `
  );
  return rows;
}

async function getRequestsByAssetUnit(asset_unit_id) {
  const { rows } = await db.query(
    `
    SELECT r.*, ir.* 
    FROM issue_reports ir
    JOIN requests r ON ir.request_id = r.id
    WHERE ir.asset_unit_id = $1
      AND r.status = 'pending'
    `,
    [asset_unit_id]
  );
  return rows;
}

async function createIssueReport(data) {
  const {
    request_id,
    asset_id,
    asset_unit_id,
    reporter_email,
    description,
    impact,
    urgency,
  } = data;
  const { rows } = await db.query(
    "INSERT INTO issue_reports (request_id, asset_id, asset_unit_id, reporter_email, description, impact, urgency) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    [
      request_id,
      asset_id,
      asset_unit_id,
      reporter_email,
      description,
      impact,
      urgency,
    ]
  );
  return {
    id: rows[0].id,
    request_id,
    asset_id,
    asset_unit_id,
    reporter_email,
    description,
    impact,
    urgency,
  };
}

export {
  getIssueReports,
  getReportsAsMaintenanceRequest,
  createIssueReport,
  getRequestsByAssetUnit,
};
