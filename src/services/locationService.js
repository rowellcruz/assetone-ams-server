const locationModel = require("../models/locationModel");

async function getAllLocations(filters = {}) {
  return await locationModel.getAllLocations(filters);
}

async function getLocationByID(id) {
  return await locationModel.getLocationByID(id);
}

async function createLocation(locationData) {
  return await locationModel.createLocation(locationData);
}

async function deleteLocationsByIDs(ids) {
  return await locationModel.deleteLocationsByIDs(ids);
}

async function updateFullLocation(id, locationData) {
  return await locationModel.updateFullLocation(id, locationData);
}

async function updateLocationPartial(id, fieldsToUpdate) {
  return await locationModel.updateLocationPartial(id, fieldsToUpdate);
}

async function deleteLocationByID(id) {
  return await locationModel.deleteLocationByID(id);
}

module.exports = {
  getAllLocations,
  getLocationByID,
  createLocation,
  deleteLocationsByIDs,
  updateFullLocation,
  updateLocationPartial,
  deleteLocationByID,
};
