import db from "../config/db.js";

async function createRequest(data) {
  const { asset_unit_id, reporter_email, description, impact, urgency } = data;
  const { rows } = await db.query(
    "INSERT INTO issue_reports (asset_unit_id, reporter_email, description, impact, urgency) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [asset_unit_id, reporter_email, description, impact, urgency]
  );
  return {
    id: rows[0].id,
    asset_unit_id,
    reporter_email,
    description,
    impact,
    urgency,
  };
}

export { createRequest };
