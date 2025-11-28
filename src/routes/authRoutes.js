import express from "express";
import * as authController from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
const MODULE = "auth";

router.post("/login", asyncHandler(authController.login, MODULE, "LOGIN"));
router.post("/register", asyncHandler(authController.register, MODULE, "REGISTER"));
router.post("/request-password-reset", asyncHandler(authController.requestPasswordReset, MODULE, "REQUEST"));
router.post("/reset-password", asyncHandler(authController.resetPassword, MODULE, "RESET"));
router.post("/change-password/:id", asyncHandler(authController.changePassword, MODULE, "UPDATE"));

export default router;
