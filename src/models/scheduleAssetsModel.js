import db from "../config/db.js";
import * as itemModel from "./itemModel.js";

async function getAssignedAssetsForOccurrence(templateId) {
  const { rows: units } = await db.query(`
    SELECT sa.asset_unit_id, au.asset_id, au.brand
    FROM schedule_template_assets AS sa
    JOIN asset_units AS au ON sa.asset_unit_id = au.id
    WHERE sa.schedule_template_id = $1
  `, [templateId]);

  const enriched = await Promise.all(units.map(async (unit) => {
    const asset = await itemModel.getAssetByID(unit.asset_id);
    return {
      ...unit,
      asset_type: asset.type,
    };
  }));

  return enriched;
}

async function getAssignedAssetsByTemplateId(templateId) {
  const { rows } = await db.query(
    `SELECT 
       sa.*, 
       au.unit_tag, 
       d.name AS department_name,
       CONCAT(l.name, ' - ', sl.name) AS location_name
     FROM schedule_template_assets AS sa
     JOIN asset_units AS au ON sa.asset_unit_id = au.id
     JOIN departments AS d ON au.department_id = d.id
     LEFT JOIN sub_locations AS sl ON au.sub_location_id = sl.id
     LEFT JOIN locations AS l ON sl.location_id = l.id
     WHERE sa.schedule_template_id = $1`,
    [templateId]
  );
  return rows;
}

async function assignAssets(occurrence_id, asset_unit_ids) {
  const insertPromises = asset_unit_ids.map((asset_unit_id) =>
    db.query(
      "INSERT INTO schedule_template_assets (schedule_occurrence_id, asset_unit_id) VALUES ($1, $2)",
      [occurrence_id, asset_unit_id]
    )
  );

  await Promise.all(insertPromises);

  return { occurrence_id, asset_unit_ids };
}

export {
  getAssignedAssetsForOccurrence,
  getAssignedAssetsByTemplateId,
  assignAssets,
};
