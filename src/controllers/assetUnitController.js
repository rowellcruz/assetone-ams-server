const assetUnitService = require("../services/assetUnitService");

const getAssetUnits = async (req, res) => {
  const filters = {
    assetId: req.query.assetId,
    // Add more filters if needed
  };

  const assetUnits = await assetUnitService.getAllAssetUnits(filters);
  res.json(assetUnits);
};

const getAssetUnitByID = async (req, res) => {
  const { id } = req.params;
  const assetUnit = await assetUnitService.getAssetUnitByID(id);
  if (!assetUnit) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json(assetUnit);
};

const getAssetUnitsByAssetID = async (req, res) => {
  const { id } = req.params;
  const assetUnits = await assetUnitService.getAssetUnitsByAssetID(id);
  res.json(assetUnits);
};

const createAssetUnit = async (req, res) => {
  const createdAssetUnit = await assetUnitService.createAssetUnit(req.body);
  res.status(201).json(createdAssetUnit);
};

const updateAssetUnitPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await assetUnitService.updateAssetUnitPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json(updated);
};

const deleteAssetUnitByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await assetUnitService.deleteAssetUnitByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Asset unit not found");
  }
  res.json({ message: "Asset unit deleted successfully" });
};

const deleteAssetUnitsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await assetUnitService.deleteAssetUnitsByIDs(ids);
  res.json({ message: "Asset units deleted successfully" });
};

module.exports = {
  getAssetUnits,
  getAssetUnitByID,
  getAssetUnitsByAssetID,
  createAssetUnit,
  updateAssetUnitPartial,
  deleteAssetUnitByID,
  deleteAssetUnitsByIDs,
};
