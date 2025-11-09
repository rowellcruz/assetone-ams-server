import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
  register,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
const MODULE = "auth";

router.post("/login", authenticate, asyncHandler(login, MODULE));
router.post("/register", authenticate, asyncHandler(register, MODULE));
router.post(
  "/request-password-reset",
  authenticate,
  asyncHandler(requestPasswordReset, MODULE)
);
router.post(
  "/reset-password",
  authenticate,
  asyncHandler(resetPassword, MODULE)
);

export default router;
