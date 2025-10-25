import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as requestedItemModel from "../models/requestedItemModel.js";
import * as attachmentModel from "../models/procurementAttachmentModel.js";
import * as vendorModel from "../models/vendorModel.js";
import * as purchaseOrderModel from "../models/purchaseOrderModel.js";
import * as purchaseOrderItemModel from "../models/purchaseOrderItemModel.js";
import * as itemDistributionModel from "../models/itemDistributionModel.js";
import * as itemUnitService from "../services/itemUnitService.js";
import * as itemModel from "../models/itemModel.js";

export async function getPurchaseRequests() {
  return await purchaseRequestModel.getPurchaseRequests();
}

export async function getPurchaseRequestById(id) {
  const purchaseRequest = await purchaseRequestModel.getPurchaseRequestById(id);

  const requested_items = await requestedItemModel.getRequestedItemsByRequestId(
    purchaseRequest.id
  );
  return { ...purchaseRequest, requested_items };
}

export async function createPurchaseRequest(purchaseRequestData) {
  const { requested_items, ...requestData } = purchaseRequestData;

  const purchaseRequest = await purchaseRequestModel.createPurchaseRequest(
    requestData
  );

  if (Array.isArray(requested_items) && requested_items.length > 0) {
    for (const item of requested_items) {
      await requestedItemModel.createRequestedItems({
        ...item,
        purchase_request_id: purchaseRequest.id,
      });
    }
  }

  return purchaseRequest;
}

export async function updatePurchaseRequestPartial(id, fieldsToUpdate) {
  return await purchaseRequestModel.updatePurchaseRequestPartial(
    id,
    fieldsToUpdate
  );
}

export async function addAttachment(requestId, file, uploadedBy, module) {
  return await attachmentModel.createAttachment(
    requestId,
    file.filename,
    file.originalname,
    file.mimetype,
    uploadedBy,
    module
  );
}

export async function listAttachments(requestId, filters = {}) {
  return await attachmentModel.getAttachmentsByTask(requestId, filters);
}

export async function removeAttachment(id) {
  return await attachmentModel.deleteAttachment(id);
}

export async function selectVendor(requestId, vendorData) {
  if (!["new", "existing"].includes(vendorData.type)) {
    throw new Error("Invalid vendor data");
  }

  let vendorId = vendorData.vendor_id;

  if (vendorData.type === "new") {
    const vendor = await vendorModel.createVendor(vendorData);
    vendorId = vendor.id;
  }

  const purchaseOrder = await purchaseOrderModel.createPurchaseOrder({
    purchase_request_id: requestId,
    vendor_id: vendorId,
  });

  if (Array.isArray(vendorData.finalizedItems)) {
    for (const item of vendorData.finalizedItems) {
      await purchaseOrderItemModel.createPurchaseOrderItem({
        purchase_order_id: purchaseOrder.id,
        brand: item.brand,
        item_name: item.item_name,
        specifications: item.specifications,
        quantity: item.quantity,
        unit_price: item.unit_price,
      });
    }
  }

  return purchaseOrder;
}

export async function acquirePOItem(id, poItemId, data) {
  if (!id || !poItemId || !data) throw new Error("Error");

  const updatedPoItem = await purchaseOrderItemModel.updatePOItemPartial(
    poItemId,
    {
      useful_life: data.useful_life,
      acquired_date: new Date(),
    }
  );

  for (const item of data.items) {
    let itemRecord = await itemModel.getAllItems({ name: item.item_name });

    let itemId;
    if (itemRecord && itemRecord.length > 0) {
      itemId = Number(itemRecord[0].id);
    } else {
      const newItem = await itemModel.createItem({
        name: item.item_name,
        category_id: data.item_category_id,
        created_by: data.acquired_by,
        updated_by: data.acquired_by,
      });
      itemId = newItem.id;
    }

    const serials = Array.isArray(data.serial_numbers)
      ? data.serial_numbers
      : [];
    const qty = serials.length > 0 ? serials.length : data.quantity;

    for (let i = 0; i < qty; i++) {
      // 1. Create item unit
      const itemUnit = await itemUnitService.createItemUnit({
        item_id: itemId,
        vendor_id: data.vendor_id,
        brand: item.brand,
        status: "available",
        condition: 100,
        serial_number: serials[i] || null,
        useful_life: item.useful_life,
        purchase_price: item.unit_price,
        acquisition_date: new Date(),
        owner_department_id: null,
        is_legacy: false,
        created_by: data.acquired_by,
        updated_by: data.acquired_by,
      });

      // 2. Insert into items_for_distribution
      await itemDistributionModel.createItemForDistribution({
        purchase_request_id: data.purchase_request_id,
        item_unit_id: itemUnit.id,
        received_at: null,
      });
    }
  }
}

export async function getItemForDistributionByPRId(id) {
  return await itemDistributionModel.getItemsForDistributionByPRId();
}
