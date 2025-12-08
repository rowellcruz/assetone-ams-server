import * as vendorModel from "../models/vendorModel.js";

export async function getAllVendors(filters = {}) {
  return await vendorModel.getAllVendors(filters);
}

export async function getVendorByID(id) {
  const vendor = await vendorModel.getVendorByID(id);
  return vendor || null;
}

export async function createVendor(vendorData) {
  const existingVendor = await vendorModel.getAllVendors({
    name: vendorData.name,
  });

  if (existingVendor.length > 0) throw new Error("Vendor already exists");
  return vendorModel.createVendor(vendorData);
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
