import express from "express";
import cors from "cors";
import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import itemUnitRoutes from "./routes/itemUnitRoutes.js";
import itemCategoryRoutes from "./routes/itemCategoryRoutes.js";
import scheduleTemplateRoutes from "./routes/scheduleTemplateRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import procurementTaskRoutes from "./routes/procurementTaskRoutes.js";
import purchaseRequestRoutes from "./routes/purchaseRequestRoutes.js";
import completionRequestRoutes from "./routes/completionRequestRoutes.js";
import maintenanceRequestRoutes from "./routes/maintenanceRequestRoutes.js";
import itemRequestRoutes from "./routes/itemRequestRoutes.js";
import itemDistributionRoutes from "./routes/itemDistributionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import subLocationRoutes from "./routes/subLocationRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import metricRoutes from "./routes/metricRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import borrowLogRoutes from "./routes/borrowLogRoutes.js";
import relocationLogRoutes from "./routes/relocationLogRoutes.js";
import testRoute from "./routes/testRoute.js";

import errorHandler from "./middlewares/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CLIENT_URLS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "connect-src": [
          "'self'",
          "http://localhost:5000",
          "https://assetone-client.vercel.app",
          "https://assetone-ams-server.onrender.com"
        ],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:"],
        "font-src": ["'self'", "https:", "data:"],
        "object-src": ["'none'"],
      },
    },
  })
);

app.use(express.json());

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/item-units", itemUnitRoutes);
app.use("/api/schedule-templates", scheduleTemplateRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/completion-requests", completionRequestRoutes);
app.use("/api/maintenance-requests", maintenanceRequestRoutes);
app.use("/api/item-requests", itemRequestRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/sub-locations", subLocationRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/metrics", metricRoutes);
app.use("/api/borrow-log", borrowLogRoutes);
app.use("/api/relocation-log", relocationLogRoutes);
app.use("/api/test", testRoute);

app.use(errorHandler);

export default app;
