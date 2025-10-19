import * as itemCategoryService from "../services/itemCategoryService.js";

export const getItemCategories = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
  };

  const categories = await itemCategoryService.getAllItemCategories(filters);
  res.json(categories);
};

export const getItemCategoryByID = async (req, res) => {
  const { id } = req.params;
  const category = await itemCategoryService.getItemCategoryByID(id);
  if (!category) {
    res.status(404);
    throw new Error("Item category not found");
  }
  res.json(category);
};

export const createItemCategory = async (req, res) => {
  const createdItemCategory = await itemCategoryService.createItemCategory(req.body);
  res.status(201).json(createdItemCategory);
};

export const deleteItemCategoriesByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await itemCategoryService.deleteItemCategoriesByIDs(ids);
  res.json({ message: "Item categories deleted successfully" });
};

export const updateItemCategoryPartial = async (req, res) => {
  const { id } = req.params;
  const updatedCategory = await itemCategoryService.updateItemCategoryPartial(id, req.body);
  if (!updatedCategory) {
    res.status(404);
    throw new Error("Item category not found");
  }
  res.json(updatedCategory);
};

export const deleteItemCategoryByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await itemCategoryService.deleteItemCategoryByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Item category not found");
  }
  res.json({ message: "Item category deleted successfully" });
};
