import * as itemDistributionModel from "../models/itemDistributionModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as purchaseOrderModel from "../models/purchaseOrderModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";
import * as borrowLogModel from "../models/borrowLogModel.js";

const ALL_CONDITIONS = [
  "Excellent",
  "Very Good",
  "Good",
  "Average",
  "Fair",
  "Poor",
];

export async function getOrderOnTime() {
  const items = await itemDistributionModel.getItemsForDistribution({
    receivedOnly: true,
  });

  let totalReceived = 0;
  let onTimeCount = 0;
  let lateCount = 0;

  for (const item of items) {
    const pr = await purchaseRequestModel.getPurchaseRequestById(
      item.purchase_request_id
    );

    if (!pr) continue;

    totalReceived++;

    const receivedAt = new Date(item.received_at);
    const requiredDate = new Date(pr.date_required);

    if (receivedAt <= requiredDate) {
      onTimeCount++;
    } else {
      lateCount++;
    }
  }

  const onTimeRate =
    totalReceived > 0 ? (onTimeCount / totalReceived) * 100 : 0;

  return {
    total_items_received: totalReceived,
    on_time: onTimeCount,
    late: lateCount,
    on_time_rate: parseFloat(onTimeRate.toFixed(2)),
  };
}

export async function getCostSavings() {
  const { total_planned, total_actual } =
    await purchaseRequestModel.getPurchaseRequestCosts();

  const total_planned_num = Number(total_planned || 0);
  const total_actual_num = Number(total_actual || 0);
  const cost_savings = total_planned_num - total_actual_num;
  const savings_percent =
    total_planned_num > 0 ? (cost_savings / total_planned_num) * 100 : 0;

  return {
    total_planned: total_planned_num,
    total_actual: total_actual_num,
    cost_savings,
    savings_percent,
  };
}

export async function getLeadTimeTrend() {
  const rows = await purchaseOrderModel.getLeadTimeRows();

  // Step 1: Group lead times by YYYY-MM
  const map = {};
  for (const row of rows) {
    const month = row.delivery_month.toISOString().slice(0, 7); // "YYYY-MM"
    const leadTime = Number(row.lead_time_days);

    if (!map[month]) map[month] = [];
    map[month].push(leadTime);
  }

  // Step 2: Generate last 12 months
  const result = [];
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - i + 1);
    const key = d.toISOString().slice(0, 7); // "YYYY-MM"

    const leadTimes = map[key] || [];
    const avgLeadTime = leadTimes.length
      ? Number(
          (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(2)
        )
      : 0;

    const monthName = d.toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    result.push({ month: monthName, avgLeadTime });
  }

  return result;
}

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