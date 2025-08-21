const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const assetRoutes = require('./routes/assetRoutes');
const assetUnitRoutes = require('./routes/assetUnitRoutes');
const assetCategoryRoutes = require('./routes/assetCategoryRoutes');
const scheduleTemplateRoutes = require('./routes/scheduleTemplateRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const completionRequestRoutes = require('./routes/completionRequestRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const locationRoutes = require('./routes/locationRoutes');
const subLocationRoutes = require('./routes/subLocationRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require("./middlewares/errorHandler");

app.use(cors({
  origin: ["http://localhost:5173", "https://assetone-ams-client.vercel.app"],
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
app.use('/api/departments', departmentRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-locations', subLocationRoutes);
app.use('/api/vendors', vendorRoutes);
app.use(errorHandler);

module.exports = app;
