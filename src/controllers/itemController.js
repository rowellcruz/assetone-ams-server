import * as itemService from "../services/itemService.js";

export const getItems = async (req, res) => {
  const user = req.user;
  const filters = {};
  if (req.query.departmentId) filters.departmentId = req.query.departmentId;
  if (user.role === "technician") filters.departmentId = user.department_id;

  const items = await itemService.getAllItems(filters);
  res.json(items);
};

export const getItemByID = async (req, res) => {
  const { id } = req.params;
  const item = await itemService.getItemByID(id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }
  res.json(item);
};

export const getUnitStickers = async (req, res) => {
  const { unitIds } = req.body;
  if (!unitIds || !Array.isArray(unitIds) || unitIds.length === 0) {
    return res.status(400).json({ message: "unitIds array is required" });
  }

  const pdfBuffer = await itemService.generateStickersPDF(unitIds);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=stickers.pdf");
  res.send(pdfBuffer);
};

export const createItem = async (req, res) => {
  const createdItem = await itemService.createItem(req.body);
  res.status(201).json(createdItem);
};

export const importItems = async (req, res) => {
  const result = await itemService.importItems(req.file, req.user);
  res.status(201).json(result);
};

export const updateItemPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await itemService.updateItemPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Item not found");
  }
  res.json(updated);
};

export const deleteItemByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await itemService.deleteItemByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Item not found");
  }
  res.json({ message: "Item deleted successfully" });
};

export const deleteItemsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await itemService.deleteItemsByIDs(ids);
  res.json({ message: "Items deleted successfully" });
};
