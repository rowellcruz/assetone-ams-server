const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require("../middlewares/authMiddleware");

router.get("/", authenticate, asyncHandler(vendorController.getVendors));
router.get("/:id", authenticate, asyncHandler(vendorController.getVendorByID));
router.post("/", authenticate, asyncHandler(vendorController.createVendor));
router.post("/bulk-delete", authenticate, asyncHandler(vendorController.deleteVendorsByIDs));
router.put("/:id", authenticate, asyncHandler(vendorController.replaceVendor));
router.patch("/:id", authenticate, asyncHandler(vendorController.updateVendorPartial));
router.delete("/:id", authenticate, asyncHandler(vendorController.deleteVendorByID));

module.exports = router;
