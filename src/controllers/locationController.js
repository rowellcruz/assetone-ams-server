import * as locationService from "../services/locationService.js";

export const getLocations = async (req, res) => {
  const filters = {
    departmentId: req.query.departmentId,
  };

  const locations = await locationService.getAllLocations(filters);
  res.json(locations);
};

export const getLocationByID = async (req, res) => {
  const { id } = req.params;
  const location = await locationService.getLocationByID(id);
  if (!location) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(location);
};

export const createLocation = async (req, res) => {
  const createdLocation = await locationService.createLocation(req.body);
  res.status(201).json(createdLocation);
};

export const deleteLocationsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await locationService.deleteLocationsByIDs(ids);
  res.json({ message: "Locations deleted successfully" });
};

export const replaceLocation = async (req, res) => {
  const { id } = req.params;
  const updatedLocation = await locationService.updateFullLocation(id, req.body);
  if (!updatedLocation) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(updatedLocation);
};

export const updateLocationPartial = async (req, res) => {
  const { id } = req.params;
  const updatedLocation = await locationService.updateLocationPartial(id, req.body);
  if (!updatedLocation) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json(updatedLocation);
};

export const deleteLocationByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await locationService.deleteLocationByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Location not found");
  }
  res.json({ message: "Location deleted successfully" });
};
