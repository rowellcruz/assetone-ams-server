import * as subLocationModel from "../models/subLocationModel.js";
import * as subLocationAssetModel from "../models/subLocationAssetModel.js";
import * as assetUnitModel from "../models/assetUnitModel.js";

export async function getAllSubLocations(filters = {}) {
  return await subLocationModel.getAllSubLocations(filters);
}

export async function getSubLocationByID(id) {
  return await subLocationModel.getSubLocationByID(id);
}

export async function getSubLocationsByLocationID(locationId) {
  return await subLocationModel.getAllSubLocations({ locationId });
}

export async function getAssetRequestByLocationId(subLocationId) {
  return await subLocationAssetModel.getSubLocationAssetsByID(subLocationId);
}

export async function createSubLocation(subLocationData) {
  return await subLocationModel.createSubLocation(subLocationData);
}

export async function updateSubLocationPartial(id, fieldsToUpdate) {
  return await subLocationModel.updateSubLocationPartial(id, fieldsToUpdate);
}

export async function updateSubLocationAssetPartial(id, fieldsToUpdate) {
  return await subLocationAssetModel.updateSubLocationAssetPartial(
    id,
    fieldsToUpdate
  );
}

export async function deliverUnits(id, subLocationData) {
  const availableUnits = await assetUnitModel.getAllAssetUnits({
    assetId: subLocationData.asset_id,
    subLocationId: null,
  });

  console.error(availableUnits);
  const quantity = Number(subLocationData.quantity);
  if (availableUnits.length < quantity) {
    throw new Error("There is not enough stock available");
  }

  for (let i = 0; i < subLocationData.quantity; i++) {
    await assetUnitModel.updateAssetUnitPartial(availableUnits[i].id, {
      sub_location_id: subLocationData.sub_location_id,
    });
  }

  const approved = await updateSubLocationAssetPartial(id, {
    status: "approved",
    updated_at: new Date(),
  });

  return approved;
}

export async function deleteSubLocationByID(id) {
  return await subLocationModel.deleteSubLocationByID(id);
}

export async function deleteSubLocationsByIDs(ids) {
  return await subLocationModel.deleteSubLocationsByIDs(ids);
}
