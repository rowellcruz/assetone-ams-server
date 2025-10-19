import * as itemModel from "../models/itemModel.js";

export async function getAllItems(filters = {}) {
  return await itemModel.getAllItems(filters);
}

export async function getItemByID(id) {
  return await itemModel.getItemByID(id);
}

export async function createItem(itemData) {
  return await itemModel.createItem(itemData);
}

export async function updateItemPartial(id, fieldsToUpdate) {
  return await itemModel.updateItemPartial(id, fieldsToUpdate);
}

export async function deleteItemByID(id) {
  return await itemModel.deleteItemByID(id);
}

export async function deleteItemsByIDs(ids) {
  return await itemModel.deleteItemsByIDs(ids);
}
