import * as subLocationModel from "../models/subLocationModel.js";
import * as itemUnitModel from "../models/itemUnitModel.js";

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

export async function deliverUnits(id, subLocationData) {
  const availableUnits = await itemUnitModel.getAllAssetUnits({
    assetId: subLocationData.asset_id,
    subLocationId: null,
  });

  const quantity = Number(subLocationData.quantity);
  if (availableUnits.length < quantity) {
    throw new Error("There is not enough stock available");
  }

  for (let i = 0; i < subLocationData.quantity; i++) {
    await itemUnitModel.updateAssetUnitPartial(availableUnits[i].id, {
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
