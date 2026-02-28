const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const Stock = require('../models/stockSchema');

// @desc    Get all stocks for management
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;