import express from "express";
import * as vendorController from "../controllers/vendorController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, asyncHandler(vendorController.getVendors));
router.get("/:id", authenticate, asyncHandler(vendorController.getVendorByID));
router.post("/", authenticate, asyncHandler(vendorController.createVendor));
router.post("/bulk-delete", authenticate, asyncHandler(vendorController.deleteVendorsByIDs));
router.put("/:id", authenticate, asyncHandler(vendorController.replaceVendor));
router.patch("/:id", authenticate, asyncHandler(vendorController.updateVendorPartial));
router.delete("/:id", authenticate, asyncHandler(vendorController.deleteVendorByID));

export default router;
