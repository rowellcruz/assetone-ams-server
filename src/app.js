import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import assetUnitRoutes from './routes/assetUnitRoutes.js';
import assetCategoryRoutes from './routes/assetCategoryRoutes.js';
import scheduleTemplateRoutes from './routes/scheduleTemplateRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import completionRequestRoutes from './routes/completionRequestRoutes.js';
import issueReportRoutes from './routes/issueReportRoutes.js';
import assetRequestRoutes from './routes/assetRequestRoutes.js';
import maintenanceRequestRoutes from './routes/maintenanceRequestRoutes.js';
import procurementRequestRoutes from './routes/procurementRequestRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import subLocationRoutes from './routes/subLocationRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import errorHandler from './middlewares/errorHandler.js';

const app = express();
const allowedOrigins = process.env.CLIENT_URLS.split(",");

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

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/asset-units', assetUnitRoutes);
app.use('/api/asset-categories', assetCategoryRoutes);
app.use('/api/schedule-templates', scheduleTemplateRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/completion-requests', completionRequestRoutes);
app.use('/api/issue-reports', issueReportRoutes);
app.use('/api/asset-requests', assetRequestRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use('/api/procurement-requests', procurementRequestRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-locations', subLocationRoutes);
app.use('/api/vendors', vendorRoutes);

app.use(errorHandler);

export default app;
