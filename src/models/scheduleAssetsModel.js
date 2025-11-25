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

async function getScheduleUnitsByTechnician(userId) {
  const { rows } = await db.query(
    `SELECT 
        su.*, 
        au.unit_tag, 
        i.name AS item_name,
        d.name AS department_name,
        CONCAT(l.name, ' - ', sl.name) AS location_name,
        so.scheduled_date,
        so.status AS occurrence_status
      FROM schedule_units AS su
      JOIN schedule_occurrences AS so ON su.occurrence_id = so.id
      JOIN schedule_technicians AS st ON st.occurrence_id = so.id
      JOIN item_units AS au ON su.item_unit_id = au.id
      JOIN items AS i ON au.item_id = i.id
      JOIN departments AS d ON au.owner_department_id = d.id
      LEFT JOIN sub_locations AS sl ON au.sub_location_id = sl.id
      LEFT JOIN locations AS l ON sl.location_id = l.id
      WHERE st.user_id = $1`,
    [userId]
  );
  return rows;
}


async function getAssignedAssetsByOccurrenceId(occurrenceId) {
  const { rows } = await db.query(
    `SELECT 
       sa.*, 
       au.unit_tag, 
       d.name AS department_name,
       CONCAT(l.name, ' - ', sl.name) AS location_name
     FROM schedule_units AS sa
     LEFT JOIN item_units AS au ON sa.item_unit_id = au.id
     LEFT JOIN departments AS d ON au.owner_department_id = d.id
     LEFT JOIN sub_locations AS sl ON au.sub_location_id = sl.id
     LEFT JOIN locations AS l ON sl.location_id = l.id
     WHERE sa.occurrence_id = $1`,
    [occurrenceId]
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

async function updateScheduleAssetStatus(occurrenceId, unitId, review, condition) {
  const { rows } = await db.query(
    `
    UPDATE schedule_units
      SET status = 'completed',
      review = $3,
      condition = $4,
      completed_at = NOW()
    WHERE occurrence_id = $1 AND item_unit_id = $2
    RETURNING *
    `,
    [occurrenceId, unitId, review, condition]
  );

  return rows[0] || null;
}

export {
  getAssignedAssetsForOccurrence,
  getScheduleUnitsByTechnician,
  getAssignedAssetsByOccurrenceId,
  assignAssets,
  updateScheduleAssetStatus,
};
