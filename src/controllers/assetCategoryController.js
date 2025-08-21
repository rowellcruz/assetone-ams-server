const assetCategoryService = require("../services/assetCategoryService");

const getAssetCategories = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
    // More filters for categories if needed
  };

  const categories = await assetCategoryService.getAllAssetCategories(filters);
  res.json(categories);
};

const getAssetCategoryByID = async (req, res) => {
  const { id } = req.params;
  const user = await assetCategoryService.getAssetCategoryByID(id);
  if (!user) {
    res.status(404);
    throw new Error("Asset category not found");
  }
  res.json(user);
};

const createAssetCategory = async (req, res) => {
  const createdAssetCategory = await assetCategoryService.createAssetCategory(
    req.body
  );
  res.status(201).json(createdAssetCategory);
};

const deleteAssetCategoriesByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await assetCategoryService.deleteAssetCategoriesByIDs(ids);
  res.json({ message: "Asset categories deleted successfully" });
};

const replaceAssetCategory = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await assetCategoryService.updateFullAssetCategory(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error("Asset category not found");
  }
  res.json(updatedUser);
};

const updateAssetCategoryPartial = async (req, res) => {
  const { id } = req.params;
  const updatedUser = await assetCategoryService.updateAssetCategoryPartial(id, req.body);
  if (!updatedUser) {
    res.status(404);
    throw new Error("Asset category not found");
  }
  res.json(updatedUser);
};

const deleteAssetCategoryByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await assetCategoryService.deleteAssetCategoryByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Asset category not found");
  }
  res.json({ message: "Asset category deleted successfully" });
};

module.exports = { 
  getAssetCategories, 
  getAssetCategoryByID,
  createAssetCategory,
  deleteAssetCategoriesByIDs,
  replaceAssetCategory,
  updateAssetCategoryPartial,
  deleteAssetCategoryByID,
};
