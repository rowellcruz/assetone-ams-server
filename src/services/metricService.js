import * as itemDistributionModel from "../models/itemDistributionModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as purchaseOrderModel from "../models/purchaseOrderModel.js";
import * as purchaseOrderItemModel from "../models/purchaseOrderItemModel.js";


export async function getOrderOnTime() {
  // 1. Fetch all items for distribution that have been received
  const items = await itemDistributionModel.getItemsForDistribution({
    receivedOnly: true,
  });

  let totalReceived = 0;
  let onTimeCount = 0;
  let lateCount = 0;

  for (const item of items) {
    // 2. Get the purchase request for each item
    const pr = await purchaseRequestModel.getPurchaseRequestById(
      item.purchase_request_id
    );

    if (!pr) continue; // skip if somehow the PR doesn't exist

    totalReceived++;

    // 3. Compare received_at vs required date
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
  const { total_planned, total_actual } = await purchaseRequestModel.getPurchaseRequestCosts();

  const total_planned_num = Number(total_planned || 0);
  const total_actual_num = Number(total_actual || 0);
  const cost_savings = total_planned_num - total_actual_num;
  const savings_percent = total_planned_num > 0 ? (cost_savings / total_planned_num) * 100 : 0;

  return {
    total_planned: total_planned_num,
    total_actual: total_actual_num,
    cost_savings,
    savings_percent,
  };
}
