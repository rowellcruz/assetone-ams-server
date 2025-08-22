import * as subLocationService from "../services/subLocationService.js";

export const getSubLocations = async (req, res) => {
  const filters = {
    locationId: req.query.locationId,
  };

  const subLocations = await subLocationService.getAllSubLocations(filters);
  res.json(subLocations);
};

export const getSubLocationByID = async (req, res) => {
  const { id } = req.params;
  const subLocation = await subLocationService.getSubLocationByID(id);
  if (!subLocation) {
    res.status(404);
    throw new Error("Sub-location not found");
  }
  res.json(subLocation);
};

export const getSubLocationsByLocationID = async (req, res) => {
  const { locationId } = req.params;
  const subLocations = await subLocationService.getAllSubLocations({ locationId });
  res.json(subLocations);
};

export const createSubLocation = async (req, res) => {
  const createdSubLocation = await subLocationService.createSubLocation(req.body);
  res.status(201).json(createdSubLocation);
};

export const updateSubLocationPartial = async (req, res) => {
  const { id } = req.params;
  const updated = await subLocationService.updateSubLocationPartial(id, req.body);
  if (!updated) {
    res.status(404);
    throw new Error("Sub-location not found");
  }
  res.json(updated);
};

export const deleteSubLocationByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await subLocationService.deleteSubLocationByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Sub-location not found");
  }
  res.json({ message: "Sub-location deleted successfully" });
};

export const deleteSubLocationsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await subLocationService.deleteSubLocationsByIDs(ids);
  res.json({ message: "Sub-locations deleted successfully" });
};
