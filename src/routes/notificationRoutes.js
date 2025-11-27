import express from "express";
import * as notificationController from "../controllers/notificationController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, asyncHandler(notificationController.receiveNotifications));
router.post("/", authenticate, asyncHandler(notificationController.createNotification));
router.post("/:id/receivers", authenticate, asyncHandler(notificationController.addReceivers));
router.post("/:id/receiver", authenticate, asyncHandler(notificationController.markReceiverSeen));

export default router;
