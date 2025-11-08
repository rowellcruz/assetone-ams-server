import express from "express";
import { login, requestPasswordReset, resetPassword } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
const MODULE = "auth";

router.post("/login", asyncHandler(login, MODULE));
router.post(
  "/request-password-reset",
  asyncHandler(requestPasswordReset, MODULE)
);
router.post("/reset-password", asyncHandler(resetPassword, MODULE));

export default router;
