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
  try {
    const { asset_category_ids = [], ...vendorData } = req.body;

    const createdVendor = await vendorService.createVendor(vendorData);

    if (asset_category_ids.length > 0) {
      await vendorService.addVendorOffers(createdVendor.id, asset_category_ids);
    }

    res.status(201).json({
      ...createdVendor,
      asset_category_ids,
    });
  } catch (err) {
    console.error("Error creating vendor:", err);
    res.status(500).json({ message: "Failed to create vendor", error: err.message });
  }
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
