import express from "express";
import * as predictionController from "../controllers/predictionController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:unitId", authenticate, asyncHandler(predictionController.predictNextMaintenance));

export default router;
