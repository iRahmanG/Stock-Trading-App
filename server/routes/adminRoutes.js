const express = require('express');
const router = express.Router();
// Destructure all required functions from the controller
const { 
    getAdminDashboardData, 
    updateUserByAdmin, 
    updateStockByAdmin 
} = require('../controllers/adminController'); 
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Unified route for all dashboard features
router.get('/telemetry', protect, isAdmin, getAdminDashboardData);

// Admin Action Routes
router.put('/user', protect, isAdmin, updateUserByAdmin);
router.put('/stock', protect, isAdmin, updateStockByAdmin);

module.exports = router;