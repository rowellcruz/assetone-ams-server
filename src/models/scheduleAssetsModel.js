const db = require("../config/db");
const assetModel = require("./assetModel");

async function getAssignedAssetsForOccurrence(templateId) {
  const [units] = await db.execute(`
    SELECT sa.asset_unit_id, au.asset_id, au.brand
    FROM schedule_template_assets AS sa
    JOIN asset_units AS au ON sa.asset_unit_id = au.id
    WHERE sa.schedule_template_id = ?
  `, [templateId]);

  const enriched = await Promise.all(units.map(async (unit) => {
    const asset = await assetModel.getAssetByID(unit.asset_id);
    return {
      ...unit,
      asset_type: asset.type,
    };
  }));

  return enriched;
}

async function assignAssets(template_id, asset_unit_ids) {
  const insertPromises = asset_unit_ids.map((asset_unit_id) =>
    db.execute(
      "INSERT INTO schedule_template_assets (schedule_template_id, asset_unit_id) VALUES (?, ?)",
      [template_id, asset_unit_id]
    )
  );

  await Promise.all(insertPromises);

  return { template_id, asset_unit_ids };
}

module.exports = {
  getAssignedAssetsForOccurrence,
  assignAssets,
};
