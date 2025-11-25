import * as predictionService from "../services/predictionService.js";

export const predictNextMaintenance = async (req, res) => {
  const { unitId } = req.params;
  const data = await predictionService.predictNextMaintenance({
    item_unit_id: unitId,
  });

  if (!unitId) {
    return res.status(400).json({ error: "unitId is required" });
  }

  res.json(data);
};
