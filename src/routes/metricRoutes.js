import express from "express";
import * as metricController from "../controllers/metricController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/order-on-time", authenticate, asyncHandler(metricController.getOrderOnTime));
router.get("/cost-savings", authenticate, asyncHandler(metricController.getCostSavings));
router.get("/lead-time-trend", authenticate, asyncHandler(metricController.getLeadTimeTrend));
router.get("/unused-assets", authenticate, asyncHandler(metricController.getUnusedAssets));
router.get("/lost-assets", authenticate, asyncHandler(metricController.getLostAssets));

export default router;
