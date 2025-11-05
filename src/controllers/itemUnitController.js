import * as itemUnitService from "../services/itemUnitService.js";

export const getItemUnits = async (req, res) => {
  const filters = {};
  if (req.query.itemId) filters.itemId = req.query.itemId;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.ownerDepartmentId)
    filters.ownerDepartmentId = req.query.ownerDepartmentId;

  const itemUnits = await itemUnitService.getAllItemUnits(filters);
  res.json(itemUnits);
};

export const getItemUnitByID = async (req, res) => {
  const { id } = req.params;
  const itemUnit = await itemUnitService.getItemUnitByID(id);
  if (!itemUnit) {
    res.status(404);
    throw new Error("Item unit not found");
  }
  res.json(itemUnit);
};

export const getReportedItemDataById = async (req, res) => {
  const { id } = req.params;
  const itemUnit = await itemUnitService.getReportedItemDataById(id);
  if (!itemUnit) {
    res.status(404);
    throw new Error("Item unit not found");
  }
  res.json(itemUnit);
};

export const getItemUnitsByItemID = async (req, res) => {
  const { itemId } = req.params;
  const itemUnits = await itemUnitService.getItemUnitsByItemID(itemId);
  res.json(itemUnits);
};

export const getItemUnitsByDepartmentID = async (req, res) => {
  const { id, departmentId } = req.params;
  const itemUnits = await itemUnitService.getItemUnitsByDepartmentID(
    id,
    departmentId
  );
  res.json(itemUnits);
};

export const createItemUnit = async (req, res) => {
  const createdItemUnit = await itemUnitService.createItemUnit(req.body);
  res.status(201).json(createdItemUnit);
};

export const updateItemUnitPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await itemUnitService.updateItemUnitPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Item unit not found");
  }
  res.json(updated);
};

export const deleteItemUnitByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await itemUnitService.deleteItemUnitByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Item unit not found");
  }
  res.json({ message: "Item unit deleted successfully" });
};

export const deleteItemUnitsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await itemUnitService.deleteItemUnitsByIDs(ids);
  res.json({ message: "Item units deleted successfully" });
};

export const relocateItemUnit = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const relocate = await itemUnitService.relocateItemUnit(id, user, req.body);
  if (!relocate) {
    res.status(404);
    throw new Error("Item unit not found");
  }
  res.json({ message: "Item unit relocated successfully" });
};

export const itemUnitRelocationLog = async (req, res) => {
  const { id } = req.params;
  const relocate = await itemUnitService.itemUnitRelocationLog(id);
  if (!relocate) {
    res.status(404);
    throw new Error("Item unit relocation log not found");
  }
  res.json({ message: "Item unit relocation log found" });
};

export const pendingRelocationLogs = async (req, res) => {
  const { departmentId } = req.params;
  const relocate = await itemUnitService.pendingRelocationLogs(departmentId);
  if (!relocate) {
    res.status(404);
    throw new Error("Item unit relocation log not found");
  }
  res.json({ message: "Item unit relocation log found" });
};
