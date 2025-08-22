import * as subLocationModel from "../models/subLocationModel.js";

export async function getAllSubLocations(filters = {}) {
  return await subLocationModel.getAllSubLocations(filters);
}

export async function getSubLocationByID(id) {
  return await subLocationModel.getSubLocationByID(id);
}

export async function getSubLocationsByLocationID(locationId) {
  return await subLocationModel.getAllSubLocations({ locationId });
}

export async function createSubLocation(subLocationData) {
  return await subLocationModel.createSubLocation(subLocationData);
}

export async function updateSubLocationPartial(id, fieldsToUpdate) {
  return await subLocationModel.updateSubLocationPartial(id, fieldsToUpdate);
}

export async function deleteSubLocationByID(id) {
  return await subLocationModel.deleteSubLocationByID(id);
}

export async function deleteSubLocationsByIDs(ids) {
  return await subLocationModel.deleteSubLocationsByIDs(ids);
}
