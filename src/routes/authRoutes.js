import express from "express";
import {
  login,
  requestPasswordReset,
  resetPassword,
  register,
  changePassword
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();
const MODULE = "auth";

router.post("/login", asyncHandler(login, MODULE));
router.post("/register", asyncHandler(register, MODULE));
router.post(
  "/request-password-reset",
  asyncHandler(requestPasswordReset, MODULE)
);
router.post(
  "/reset-password",
  asyncHandler(resetPassword, MODULE)
);

router.post(
  "/change-password/:id",
  asyncHandler(changePassword, MODULE)
);

export default router;
