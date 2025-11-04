import * as itemDistributionModel from "../models/itemDistributionModel.js";
import * as purchaseRequestModel from "../models/purchaseRequestModel.js";

export async function getAllItemsForDistribution() {
  return await itemDistributionModel.getAllItemsForDistribution();
}

export async function getItemForDistributionByPRId(id) {
  return await itemDistributionModel.getItemForDistributionByPRId(id);
}

export async function markAsReceived(id, prid) {
  await itemDistributionModel.markAsReceived(id);

  const remainingItems =
    await itemDistributionModel.getItemForDistributionByPRId(prid, {
      remainingOnly: true,
    });

  if (remainingItems.length === 0) {
    return await purchaseRequestModel.updatePurchaseRequestPartial(prid, {
      status: "completed",
      updated_at: new Date(),
    });
  }

  return null;
}
