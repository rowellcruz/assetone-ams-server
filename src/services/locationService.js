import * as locationModel from "../models/locationModel.js";

export async function getAllLocations(filters = {}) {
  return await locationModel.getAllLocations(filters);
}

export async function getLocationByID(id) {
  return await locationModel.getLocationByID(id);
}

export async function createLocation(locationData) {
  const { sublocations = [] } = locationData;

  const normalized = sublocations.map(s => s.trim().toLowerCase());

  const duplicates = normalized.filter((s, i) => normalized.indexOf(s) !== i);
  if (duplicates.length > 0) {
    const dupList = [...new Set(duplicates)];
    throw new Error(`Duplicate sublocations in payload: ${dupList.join(", ")}`);
  }

  return await locationModel.createLocation(locationData);
}


export async function deleteLocationsByIDs(ids) {
  return await locationModel.deleteLocationsByIDs(ids);
}

export async function updateFullLocation(id, locationData) {
  return await locationModel.updateFullLocation(id, locationData);
}

export async function updateLocationPartial(id, fieldsToUpdate) {
  return await locationModel.updateLocationPartial(id, fieldsToUpdate);
}

export async function deleteLocationByID(id) {
  return await locationModel.deleteLocationByID(id);
}
