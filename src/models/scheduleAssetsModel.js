import db from "../config/db.js";
import * as itemModel from "./itemModel.js";

async function getAssignedAssetsForOccurrence(templateId) {
  const { rows: units } = await db.query(`
    SELECT sa.item_unit_id, au.item_id, au.brand
    FROM schedule_units AS sa
    JOIN item_units AS au ON sa.item_unit_id = au.id
    WHERE sa.template_id = $1
  `, [templateId]);

  const enriched = await Promise.all(units.map(async (unit) => {
    const item = await itemModel.getAssetByID(unit.item_id);
    return {
      ...unit,
      item_name: item.name,
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
     FROM schedule_units AS sa
     JOIN item_units AS au ON sa.item_unit_id = au.id
     JOIN departments AS d ON au.department_id = d.id
     LEFT JOIN sub_locations AS sl ON au.sub_location_id = sl.id
     LEFT JOIN locations AS l ON sl.location_id = l.id
     WHERE sa.template_id = $1`,
    [templateId]
  );
  return rows;
}

async function assignAssets(occurrence_id, item_unit_ids) {
  const insertPromises = item_unit_ids.map((item_unit_id) =>
    db.query(
      "INSERT INTO schedule_units (occurrence_id, item_unit_id) VALUES ($1, $2)",
      [occurrence_id, item_unit_id]
    )
  );

  await Promise.all(insertPromises);

  return { occurrence_id, item_unit_ids };
}

export {
  getAssignedAssetsForOccurrence,
  getAssignedAssetsByTemplateId,
  assignAssets,
};
