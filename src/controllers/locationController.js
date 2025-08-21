const locationService = require("../services/locationService");

const getLocations = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
    // More filters for locations if needed
  };

  const locations = await locationService.getAllLocations(filters);
  res.json(locations);
};

const getLocationByID = async (req, res) => {
  const { id } = req.params;
  const location = await locationService.getLocationByID(id);
  if (!location) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(location);
};

const createLocation = async (req, res) => {
  const createdLocation = await locationService.createLocation(req.body);
  res.status(201).json(createdLocation);
};

const deleteLocationsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await locationService.deleteLocationsByIDs(ids);
  res.json({ message: "Locations deleted successfully" });
};

const replaceLocation = async (req, res) => {
  const { id } = req.params;
  const updatedLocation = await locationService.updateFullLocation(id, req.body);
  if (!updatedLocation) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(updatedLocation);
};

const updateLocationPartial = async (req, res) => {
  const { id } = req.params;
  const updatedLocation = await locationService.updateLocationPartial(id, req.body);
  if (!updatedLocation) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(updatedLocation);
};

const deleteLocationByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await locationService.deleteLocationByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json({ message: "Location deleted successfully" });
};

module.exports = { 
  getLocations, 
  getLocationByID,
  createLocation,
  deleteLocationsByIDs,
  replaceLocation,
  updateLocationPartial,
  deleteLocationByID,
};
