import * as metricService from "../services/metricService.js";

export const getOrderOnTime = async (req, res) => {
  const data = await metricService.getOrderOnTime();
  res.json(data);
};

export const getCostSavings = async (req, res) => {
  const data = await metricService.getCostSavings();
  res.json(data);
};

export const getLeadTimeTrend = async (req, res) => {
  const data = await metricService.getLeadTimeTrend();
  res.json(data);
};
