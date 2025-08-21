const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/reset-user-password', adminController.resetUserPassword);

module.exports = router;