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
router.get("/most-borrowed-assets", authenticate, asyncHandler(metricController.getMostBorrowedAssets));
router.get("/condition-counts", authenticate, asyncHandler(metricController.getConditionCounts));
router.get("/maintenance-workload", authenticate, asyncHandler(metricController.getMaitnenanceWorkLoad));
router.get("/asset-utilization", authenticate, asyncHandler(metricController.getAssetUtilization));

export default router;
