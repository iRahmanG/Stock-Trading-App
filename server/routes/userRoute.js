const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    depositFunds
} = require('../controllers/userController');
const User = require('../models/userModel');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW: Self-deposit route for users
router.post('/deposit', protect, depositFunds);

// Admin only route: Fetch all users
router.get('/admin/users', protect, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
});

module.exports = router;