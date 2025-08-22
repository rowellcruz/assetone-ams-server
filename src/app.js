import express from 'express';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import assetUnitRoutes from './routes/assetUnitRoutes.js';
import assetCategoryRoutes from './routes/assetCategoryRoutes.js';
import scheduleTemplateRoutes from './routes/scheduleTemplateRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import completionRequestRoutes from './routes/completionRequestRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import subLocationRoutes from './routes/subLocationRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://assetone-ams-client.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));
app.get('/api', (req, res) => res.send('API is running'));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/asset-units', assetUnitRoutes);
app.use('/api/asset-categories', assetCategoryRoutes);
app.use('/api/schedule-templates', scheduleTemplateRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/completion-requests', completionRequestRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-locations', subLocationRoutes);
app.use('/api/vendors', vendorRoutes);

app.use(errorHandler);

export default app;
