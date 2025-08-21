const vendorModel = require("../models/vendorModel");

async function getAllVendors(filters = {}) {
  const vendors = await vendorModel.getAllVendors(filters);
  const offersMap = await vendorModel.getAllVendorOffersMap();

  return vendors.map((vendor) => ({
    ...vendor,
    offers: offersMap[vendor.id] || [],
  }));
}

async function getVendorByID(id) {
  const vendor = await vendorModel.getVendorByID(id);
  if (!vendor) return null;

  const offers = await vendorModel.getVendorOffers(id);
  return { ...vendor, offers };
}

async function createVendor(vendorData) {
  return await vendorModel.createVendor(vendorData);
}

async function deleteVendorsByIDs(ids) {
  return await vendorModel.deleteVendorsByIDs(ids);
}

async function updateFullVendor(id, vendorData) {
  return await vendorModel.updateFullVendor(id, vendorData);
}

async function updateVendorPartial(id, fieldsToUpdate) {
  return await vendorModel.updateVendorPartial(id, fieldsToUpdate);
}

async function deleteVendorByID(id) {
  return await vendorModel.deleteVendorByID(id);
}

async function setVendorOffers(vendorId, categoryIds) {
  await vendorModel.clearVendorOffers(vendorId);
  if (categoryIds.length > 0) {
    await vendorModel.insertVendorOffers(vendorId, categoryIds);
  }
}

module.exports = {
  getAllVendors,
  getVendorByID,
  createVendor,
  deleteVendorsByIDs,
  updateFullVendor,
  updateVendorPartial,
  deleteVendorByID,
  setVendorOffers,
};
