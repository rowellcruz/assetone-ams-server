import * as itemDistributionService from "../services/itemDistributionService.js";

export const getAllItemsForDistribution = async (req, res) => {
  const data = await itemDistributionService.getAllItemsForDistribution();
  res.json(data);
};

export const markAsReceived = async (req, res) => {
  const data = await itemDistributionService.markAsReceived();
  res.json(data);
};