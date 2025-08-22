import * as vendorService from "../services/vendorService.js";

export const getVendors = async (req, res) => {
  const filters = {};
  const vendors = await vendorService.getAllVendors(filters);
  res.json(vendors);
};

export const getVendorByID = async (req, res) => {
  const { id } = req.params;
  const vendor = await vendorService.getVendorByID(id);
  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }
  res.json(vendor);
};

export const createVendor = async (req, res) => {
  const { offers = [], ...vendorData } = req.body;
  const createdVendor = await vendorService.createVendor(vendorData);

  if (offers.length > 0) {
    await vendorService.setVendorOffers(createdVendor.id, offers);
  }

  res.status(201).json({ ...createdVendor, offers });
};

export const deleteVendorsByIDs = async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error("IDs array is required");
  }
  await vendorService.deleteVendorsByIDs(ids);
  res.json({ message: "Vendors deleted successfully" });
};

export const replaceVendor = async (req, res) => {
  const { id } = req.params;
  const { offers = [], ...vendorData } = req.body;

  const updatedVendor = await vendorService.updateFullVendor(id, vendorData);
  if (!updatedVendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  await vendorService.setVendorOffers(id, offers);

  res.json({ ...updatedVendor, offers });
};

export const updateVendorPartial = async (req, res) => {
  const { id } = req.params;
  const updatedVendor = await vendorService.updateVendorPartial(id, req.body);
  if (!updatedVendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }
  res.json(updatedVendor);
};

export const deleteVendorByID = async (req, res) => {
  const { id } = req.params;
  const deleted = await vendorService.deleteVendorByID(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Vendor not found");
  }
  res.json({ message: "Vendor deleted successfully" });
};
