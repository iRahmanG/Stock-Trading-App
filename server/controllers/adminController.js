const User = require('../models/userModel');
const Order = require('../models/orderSchema');
const Stock = require('../models/stockSchema');

// @desc    Fetch comprehensive system data for the Admin Dashboard
const getAdminDashboardData = async (req, res) => {
    try {
        // Fetch data for the four telemetry cards
        const activeUsersCount = await User.countDocuments();
        
        // Fetch data for the management tables
        const allUsers = await User.find({}).select('-password');
        const allStocks = await Stock.find({});
        const globalLedger = await Order.find({}).sort({ createdAt: -1 }).limit(20);

        res.json({
            activeUsers: activeUsersCount,
            users: allUsers,
            stocks: allStocks,
            transactions: globalLedger,
            serverStatus: "Operational",
            latency: "24ms"
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load admin telemetry." });
    }
};

module.exports = { getAdminDashboardData };