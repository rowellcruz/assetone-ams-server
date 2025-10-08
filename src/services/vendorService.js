import * as vendorModel from "../models/vendorModel.js";
import * as vendorOfferModel from "../models/vendorOfferModel.js";

export async function getAllVendors(filters = {}) {
  const vendors = await vendorModel.getAllVendors(filters);
  const offersMap = await vendorModel.getAllVendorOffersMap();

  return vendors.map((vendor) => ({
    ...vendor,
    asset_category_ids: (offersMap[vendor.id] || []).map(o => o.id),
  }));
}

export async function getVendorByID(id) {
  const vendor = await vendorModel.getVendorByID(id);
  if (!vendor) return null;

  const offers = await vendorModel.getVendorOffers(id);
  return { ...vendor, offers };
}

export async function createVendor(vendorData) {
  return vendorModel.createVendor(vendorData);
}

export async function addVendorOffers(vendorId, assetCategoryIds) {
  return vendorOfferModel.addVendorOffers(vendorId, assetCategoryIds);
}

export async function deleteVendorsByIDs(ids) {
  return vendorModel.deleteVendorsByIDs(ids);
}

export async function updateFullVendor(id, vendorData) {
  return vendorModel.updateFullVendor(id, vendorData);
}

export async function updateVendorPartial(id, fieldsToUpdate) {
  return vendorModel.updateVendorPartial(id, fieldsToUpdate);
}

export async function deleteVendorByID(id) {
  return vendorModel.deleteVendorByID(id);
}

export async function setVendorOffers(vendorId, assetIds) {
  await vendorModel.clearVendorOffers(vendorId);
  if (Array.isArray(assetIds) && assetIds.length > 0) {
    await vendorModel.insertVendorOffers(vendorId, assetIds);
  }
}
