import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import assetUnitRoutes from './routes/assetUnitRoutes.js';
import assetCategoryRoutes from './routes/assetCategoryRoutes.js';
import scheduleTemplateRoutes from './routes/scheduleTemplateRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import procurementTaskRoutes from './routes/procurementTaskRoutes.js';
import completionRequestRoutes from './routes/completionRequestRoutes.js';
import issueReportRoutes from './routes/issueReportRoutes.js';
import assetRequestRoutes from './routes/assetRequestRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import subLocationRoutes from './routes/subLocationRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import errorHandler from './middlewares/errorHandler.js';

const app = express();
const allowedOrigins = process.env.CLIENT_URLS.split(",");

// CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// CSP via Helmet
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "default-src": ["'self'"],
      "connect-src": ["'self'", "http://localhost:5000"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "img-src": ["'self'", "data:"],
      "font-src": ["'self'", "https:", "data:"],
      "object-src": ["'none'"],
    },
  })
);

// JSON parser
app.use(express.json());


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/api/uploads", express.static(path.join(__dirname, "../uploads")));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/asset-units', assetUnitRoutes);
app.use('/api/asset-categories', assetCategoryRoutes);
app.use('/api/schedule-templates', scheduleTemplateRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/procurement-tasks', procurementTaskRoutes);
app.use('/api/completion-requests', completionRequestRoutes);
app.use('/api/issue-reports', issueReportRoutes);
app.use('/api/asset-requests', assetRequestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-locations', subLocationRoutes);
app.use('/api/vendors', vendorRoutes);

// Error handler
app.use(errorHandler);

export default app;
