import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import itemUnitRoutes from './routes/itemUnitRoutes.js';
import itemCategoryRoutes from './routes/itemCategoryRoutes.js';
import scheduleTemplateRoutes from './routes/scheduleTemplateRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import procurementTaskRoutes from './routes/procurementTaskRoutes.js';
import purchaseRequestRoutes from './routes/purchaseRequestRoutes.js';
import completionRequestRoutes from './routes/completionRequestRoutes.js';
import maintenanceRequestRoutes from './routes/maintenanceRequestRoutes.js';
import itemRequestRoutes from './routes/itemRequestRoutes.js';
import itemDistributionRoutes from './routes/itemDistributionRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import subLocationRoutes from './routes/subLocationRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import metricRoutes from './routes/metricRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import borrowLogRoutes from './routes/borrowLogRoutes.js';

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
app.use('/api/items', itemRoutes);
app.use('/api/item-units', itemUnitRoutes);
app.use('/api/item-categories', itemCategoryRoutes);
app.use('/api/items-for-distribution', itemDistributionRoutes);
app.use('/api/schedule-templates', scheduleTemplateRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/procurement-tasks', procurementTaskRoutes);
app.use('/api/purchase-requests', purchaseRequestRoutes);
app.use('/api/completion-requests', completionRequestRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use('/api/item-requests', itemRequestRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-locations', subLocationRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/metrics', metricRoutes);
app.use('/api/borrow-log', borrowLogRoutes);

// Error handler
app.use(errorHandler);

export default app;
