import * as purchaseRequestModel from "../models/purchaseRequestModel.js";
import * as requestedItemModel from "../models/requestedItemModel.js";
import * as attachmentModel from "../models/procurementAttachmentModel.js";

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

export async function listAttachments(requestId) {
  return await attachmentModel.getAttachmentsByTask(requestId);
}

export async function removeAttachment(id) {
  return await attachmentModel.deleteAttachment(id);
}
