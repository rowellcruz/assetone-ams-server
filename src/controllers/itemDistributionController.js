import * as itemDistributionService from "../services/itemDistributionService.js";

export const markAsReceived = async (req, res) => {
  const data = await itemDistributionService.markAsReceived();
  res.json(data);
};