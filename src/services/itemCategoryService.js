import * as itemCategoryModel from "../models/itemCategoryModel.js";

export async function getAllItemCategories(filters = {}) {
  return await itemCategoryModel.getAllItemCategories(filters);
}

export async function getItemCategoryByID(id) {
  return await itemCategoryModel.getItemCategoryByID(id);
}

export async function createItemCategory(itemCategoryData) {
  if (itemCategoryData.code) {
    itemCategoryData.code = itemCategoryData.code.toUpperCase();
  }
  
  return await itemCategoryModel.createItemCategory(itemCategoryData);
}

export async function deleteItemCategoriesByIDs(ids) {
  return await itemCategoryModel.deleteItemCategoriesByIDs(ids);
}

export async function updateItemCategoryPartial(id, fieldsToUpdate) {
  return await itemCategoryModel.updateItemCategoryPartial(id, fieldsToUpdate);
}

export async function deleteItemCategoryByID(id) {
  return await itemCategoryModel.deleteItemCategoryByID(id);
}
