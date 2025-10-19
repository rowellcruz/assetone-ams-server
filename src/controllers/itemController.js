import * as itemService from "../services/itemService.js";

export const getItems = async (req, res) => {
  const filters = {
    categoryId: req.query.categoryId,
  };

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

export const createItem = async (req, res) => {
  const createdItem = await itemService.createItem(req.body);
  res.status(201).json(createdItem);
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
