import db from "../config/db.js";

async function finalizeAcquisition(taskId, data, finalizedBy) {
  const {
    final_cost_per_unit,
    final_vendor_id,
    final_brand,
    useful_life_years,
    depreciation_method,
    depreciation_rate
  } = data;

  const { rows } = await db.query(
    `INSERT INTO procurement_finalizations
      (
        task_id,
        final_cost_per_unit,
        final_vendor_id,
        final_brand,
        useful_life_years,
        depreciation_method,
        depreciation_rate,
        finalized_by
      )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      taskId,
      final_cost_per_unit,
      final_vendor_id || null,
      final_brand || null,
      useful_life_years,
      depreciation_method,
      depreciation_rate,
      finalizedBy
    ]
  );

  return rows[0];
}

export default {
  finalizeAcquisition,
};
