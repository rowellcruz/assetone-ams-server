import * as purchaseRequestService from "../services/purchaseRequestService.js";

export const getPurchaseRequests = async (req, res) => {
  const purchaseRequests = await purchaseRequestService.getPurchaseRequests();
  res.json(purchaseRequests);
};

export const getPurchaseRequestById = async (req, res) => {
  const { id } = req.params;
  const purchaseRequest = await purchaseRequestService.getPurchaseRequestById(
    id
  );
  res.json(purchaseRequest);
};

export const createPurchaseRequest = async (req, res) => {
  const createdPurchaseRequest =
    await purchaseRequestService.createPurchaseRequest(req.body);
  res.status(201).json(createdPurchaseRequest);
};

export const updatePurchaseRequest = async (req, res) => {
  const { id } = req.params;
  const updated = await purchaseRequestService.updatePurchaseRequestPartial(
    id,
    req.body
  );
  if (!updated) {
    res.status(404);
    throw new Error("Purchase request not found");
  }
  res.json(updated);
};

export async function uploadAttachment(req, res, next) {
  try {
    const { requestId, module } = req.params;
    const uploadedBy = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const attachment = await purchaseRequestService.addAttachment(
      requestId,
      file,
      uploadedBy,
      module
    );
    res.status(201).json(attachment);
  } catch (err) {
    next(err);
  }
}

export async function getAttachments(req, res, next) {
  try {
    const { requestId } = req.params;
    const filters = {};
    if (req.query.module) filters.module = req.query.module;
    const attachments = await purchaseRequestService.listAttachments(requestId, filters);
    res.json(attachments);
  } catch (err) {
    next(err);
  }
}

export async function deleteAttachment(req, res, next) {
  try {
    const { id } = req.params;
    const attachment = await purchaseRequestService.removeAttachment(id);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.json({ message: "Attachment deleted", attachment });
  } catch (err) {
    next(err);
  }
}

export const selectVendor = async (req, res) => {
  const { id } = req.params;
  const createdPurchaseRequest = await purchaseRequestService.selectVendor(
    id,
    req.body
  );
  res.status(201).json(createdPurchaseRequest);
};

export const acquirePOItem = async (req, res) => {
  const { id, poItemId } = req.params;
  const createdPurchaseRequest = await purchaseRequestService.acquirePOItem(
    id,
    poItemId,
    req.body
  );
  res.status(201).json(createdPurchaseRequest);
};