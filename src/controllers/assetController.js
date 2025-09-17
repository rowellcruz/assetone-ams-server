import * as assetService from "../services/assetService.js";

export const getAssets = async (req, res) => {
  const filters = {
    categoryId: req.query.categoryId,
  };

  const assets = await assetService.getAllAssets(filters);
  res.json(assets);
};

export const getPublicAssets = async (req, res) => {
  const assets = await assetService.getPublicAssets();
  res.json(assets);
};

export const getAssetByID = async (req, res) => {
  const { id } = req.params;
  const asset = await assetService.getAssetByID(id);
  if (!asset) {
    res.status(404);
    throw new Error("Asset not found");
  }
  res.json(asset);
};

export const getAssetsByCategoryID = async (req, res) => {
  const { category_id } = req.params;
  const assets = await assetService.getAllAssets({ categoryId: category_id });
  res.json(assets);
};

export const createAsset = async (req, res) => {
  const createdAsset = await assetService.createAsset(req.body);
  res.status(201).json(createdAsset);
};

export const updateAssetPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await assetService.updateAssetPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Asset not found");
  }
  res.json(updated);
};

export const deleteAssetByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await assetService.deleteAssetByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Asset not found");
  }
  res.json({ message: "Asset deleted successfully" });
};

export const deleteAssetsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await assetService.deleteAssetsByIDs(ids);
  res.json({ message: "Assets deleted successfully" });
};
