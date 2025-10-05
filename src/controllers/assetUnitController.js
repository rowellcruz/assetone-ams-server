import * as assetUnitService from "../services/assetUnitService.js";

export const getAssetUnits = async (req, res) => {
  const filters = {
    assetId: req.query.assetId,
  };

  const assetUnits = await assetUnitService.getAllAssetUnits(filters);
  res.json(assetUnits);
};

export const getAssetUnitByID = async (req, res) => {
  const { id } = req.params;
  const assetUnit = await assetUnitService.getAssetUnitByID(id);
  if (!assetUnit) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json(assetUnit);
};

export const getReportedAssetDataById = async (req, res) => {
  const { id } = req.params;
  const assetUnit = await assetUnitService.getReportedAssetDataById(id);
  if (!assetUnit) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json(assetUnit);
};

export const getAssetUnitsByAssetID = async (req, res) => {
  const { id } = req.params;
  const assetUnits = await assetUnitService.getAssetUnitsByAssetID(id);
  res.json(assetUnits);
};

export const getAssetUnitsByDepartmentID = async (req, res) => {
  const { id, departmentId } = req.params;
  const assetUnits = await assetUnitService.getAssetUnitsByDepartmentID(id, departmentId);
  res.json(assetUnits);
};

export const createAssetUnit = async (req, res) => {
  const createdAssetUnit = await assetUnitService.createAssetUnit(req.body);
  res.status(201).json(createdAssetUnit);
};

export const updateAssetUnitPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await assetUnitService.updateAssetUnitPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json(updated);
};

export const deleteAssetUnitByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await assetUnitService.deleteAssetUnitByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json({ message: "Asset unit deleted successfully" });
};

export const deleteAssetUnitsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await assetUnitService.deleteAssetUnitsByIDs(ids);
  res.json({ message: "Asset units deleted successfully" });
};
