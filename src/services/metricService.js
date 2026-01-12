import * as itemUnitModel from "../models/itemUnitModel.js";
import * as borrowLogModel from "../models/borrowLogModel.js";
import * as activityLogModel from "../models/activityLogModel.js";

const ALL_CONDITIONS = [
  "Excellent",
  "Very Good",
  "Good",
  "Average",
  "Fair",
  "Poor",
];

export async function getUnusedAssets() {
  const availableAssets = await itemUnitModel.getAllItemUnits({
    status: "available",
  });
  const totalAssets = await itemUnitModel.getAllItemUnits();

  const unusedCount = availableAssets.length;
  const totalCount = totalAssets.length;

  const percentage = (unusedCount / totalCount) * 100;

  return {
    unused_assets: unusedCount,
    total_assets: totalCount,
    unused_percentage: Number(percentage.toFixed(2)),
  };
}

export async function getLostAssets() {
  const lostAssets = await itemUnitModel.getAllItemUnits({ status: "lost" });
  const totalAssets = await itemUnitModel.getAllItemUnits();

  const lostCount = lostAssets.length;
  const totalCount = totalAssets.length;

  const percentage = (lostCount / totalCount) * 100;

  return {
    lost_assets: lostCount,
    total_assets: totalCount,
    lost_percentage: Number(percentage.toFixed(2)),
  };
}

export async function getMostBorrowedAssets() {
  return await borrowLogModel.getMostBorrowedAssets();
}

export async function getConditionCounts() {
  const rows = await itemUnitModel.getConditionCounts();

  const map = Object.fromEntries(
    rows.map((r) => [r.condition, Number(r.value)])
  );

  return ALL_CONDITIONS.map((condition) => ({
    condition,
    value: map[condition] || 0,
  }));
}

export async function getMaitnenanceWorkLoad() {
  return await itemUnitModel.getMaintenanceLoad();
}

export async function getAssetUtilization() {
  return await itemUnitModel.getUtilization();
}

export async function getUserActivityWeeklyTrend() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

  // Calculate start of the week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  // End of the week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Fetch logs within the week
  const logs = await activityLogModel.getAllActivityLog({
    startDate: startOfWeek,
    endDate: endOfWeek,
  });

  // Initialize result array for Sun → Sat
  const weeklyTrend = [
    { day: 'Sun', count: 0 },
    { day: 'Mon', count: 0 },
    { day: 'Tue', count: 0 },
    { day: 'Wed', count: 0 },
    { day: 'Thu', count: 0 },
    { day: 'Fri', count: 0 },
    { day: 'Sat', count: 0 },
  ];

  // Count logs per day
  logs.forEach(log => {
    const logDate = new Date(log.created_at);
    const dayIndex = logDate.getDay(); // 0-6
    weeklyTrend[dayIndex].count++;
  });

  return weeklyTrend;
}

export async function getTopModuleUsage(filters = {}) {
  return await activityLogModel.getTopModuleUsage(filters);
}

export async function getAssetValues() {
  return await itemUnitModel.getItemUnitValues();
}