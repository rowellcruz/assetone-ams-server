const subLocationModel = require("../models/subLocationModel");

async function getAllSubLocations(filters = {}) {
  return await subLocationModel.getAllSubLocations(filters);
}

async function getSubLocationByID(id) {
  return await subLocationModel.getSubLocationByID(id);
}

async function getSubLocationsByLocationID(locationId) {
  return await subLocationModel.getAllSubLocations({ locationId });
}

async function createSubLocation(subLocationData) {
  return await subLocationModel.createSubLocation(subLocationData);
}

async function updateSubLocationPartial(id, fieldsToUpdate) {
  return await subLocationModel.updateSubLocationPartial(id, fieldsToUpdate);
}

async function deleteSubLocationByID(id) {
  return await subLocationModel.deleteSubLocationByID(id);
}

async function deleteSubLocationsByIDs(ids) {
  return await subLocationModel.deleteSubLocationsByIDs(ids);
}

module.exports = {
  getAllSubLocations,
  getSubLocationByID,
  getSubLocationsByLocationID,
  createSubLocation,
  updateSubLocationPartial,
  deleteSubLocationByID,
  deleteSubLocationsByIDs,
};
