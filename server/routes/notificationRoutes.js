const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');
const { protect } = require('../middlewares/authMiddleware');

// Get user-specific notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

module.exports = router;