import express from "express";
import * as vendorController from "../controllers/vendorController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
const MODULE = "vendors";

router.get("/", authenticate, asyncHandler(vendorController.getVendors));
router.get("/:id", authenticate, asyncHandler(vendorController.getVendorByID));
router.post("/", authenticate, asyncHandler(vendorController.createVendor, MODULE));
router.post("/bulk-delete", authenticate, asyncHandler(vendorController.deleteVendorsByIDs, MODULE));
router.patch("/:id", authenticate, asyncHandler(vendorController.updateVendorPartial, MODULE));
router.delete("/:id", authenticate, asyncHandler(vendorController.deleteVendorByID, MODULE));

export default router;
