import express from "express";
import { testConnection } from "../controllers/testController.js";

const router = express.Router();

router.get("/", testConnection);

export default router;
