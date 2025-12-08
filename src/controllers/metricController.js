import * as metricService from "../services/metricService.js";

export const getUnusedAssets = async (req, res) => {
  const data = await metricService.getUnusedAssets();
  res.json(data);
};

export const getLostAssets = async (req, res) => {
  const data = await metricService.getLostAssets();
  res.json(data);
};

export const getMostBorrowedAssets = async (req, res) => {
  const data = await metricService.getMostBorrowedAssets();
  res.json(data);
};

export const getConditionCounts = async (req, res) => {
  const data = await metricService.getConditionCounts();
  res.json(data);
};

export const getMaitnenanceWorkLoad = async (req, res) => {
  const data = await metricService.getMaitnenanceWorkLoad();
  res.json(data);
};


export const getAssetUtilization = async (req, res) => {
  const data = await metricService.getAssetUtilization();
  res.json(data);
};

export const getUserActivityWeeklyTrend = async (req, res) => {
  const data = await metricService.getUserActivityWeeklyTrend();
  res.json(data);
};

export const getTopModuleUsage = async (req, res) => {
  const data = await metricService.getTopModuleUsage();
  res.json(data);
};
