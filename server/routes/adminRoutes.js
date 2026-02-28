const express = require('express');
const router = express.Router();
const { getAdminDashboardData } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Unified route for all dashboard features
router.get('/telemetry', protect, isAdmin, getAdminDashboardData);

module.exports = router;