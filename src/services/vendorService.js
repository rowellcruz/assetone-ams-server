import * as vendorModel from "../models/vendorModel.js";

export async function getAllVendors(filters = {}) {
  const vendors = await vendorModel.getAllVendors(filters);
  const offersMap = await vendorModel.getAllVendorOffersMap();

  return vendors.map((vendor) => ({
    ...vendor,
    offers: offersMap[vendor.id] || [],
  }));
}

export async function getVendorByID(id) {
  const vendor = await vendorModel.getVendorByID(id);
  if (!vendor) return null;

  const offers = await vendorModel.getVendorOffers(id);
  return { ...vendor, offers };
}

export async function createVendor(vendorData) {
  return await vendorModel.createVendor(vendorData);
}

export async function deleteVendorsByIDs(ids) {
  return await vendorModel.deleteVendorsByIDs(ids);
}

export async function updateFullVendor(id, vendorData) {
  return await vendorModel.updateFullVendor(id, vendorData);
}

export async function updateVendorPartial(id, fieldsToUpdate) {
  return await vendorModel.updateVendorPartial(id, fieldsToUpdate);
}

export async function deleteVendorByID(id) {
  return await vendorModel.deleteVendorByID(id);
}

export async function setVendorOffers(vendorId, categoryIds) {
  await vendorModel.clearVendorOffers(vendorId);
  if (categoryIds.length > 0) {
    await vendorModel.insertVendorOffers(vendorId, categoryIds);
  }
}
