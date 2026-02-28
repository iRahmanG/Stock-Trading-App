const Order = require('../models/orderSchema');
const User = require('../models/userModel');
const Settings = require('../models/settingsModel');
const Stock = require('../models/stockSchema'); 
const Notification = require('../models/notificationModel'); // Ensured import

// @desc    Get all stock orders FOR THE LOGGED-IN USER ONLY
const getOrders = async (req, res) => {
    try {
        const userEmail = req.user ? req.user.email : req.query.user; 
        if (!userEmail) return res.status(401).json({ message: "Not authorized" });

        const orders = await Order.find({ user: userEmail });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new stock order (Buy/Sell) with Admin Overrides
const addOrder = async (req, res) => {
    try {
        const { user, symbol, name, price, count, totalPrice, stockType, orderType, orderStatus, stockExchange } = req.body;

        // 1. ADMIN CHECKS
        const systemSettings = await Settings.findOne();
        if (systemSettings && systemSettings.tradingHalted) {
            return res.status(403).json({ message: "Market operations are currently suspended." });
        }

        const targetedStock = await Stock.findOne({ symbol });
        if (targetedStock && targetedStock.status === 'Halted') {
            return res.status(403).json({ message: `Trading for ${symbol} is halted.` });
        }

        const trader = await User.findOne({ email: user });
        if (!trader) return res.status(404).json({ message: 'User not found' });
        if (trader.status === 'Suspended') {
            return res.status(403).json({ message: "Your trading privileges are revoked." });
        }

        // 2. TRADING LOGIC
        if (!Number.isInteger(Number(count)) || Number(count) <= 0) {
            return res.status(400).json({ message: "Fractional trading is not supported." });
        }

        const conversionRate = 90.0; 
        const valueInINR = (stockExchange === 'NSE' || stockExchange === 'BSE') 
            ? totalPrice 
            : totalPrice * conversionRate;

        if (orderType === 'sell') {
            const userOrders = await Order.find({ user, symbol });
            const currentHoldings = userOrders.reduce((acc, order) => {
                return order.orderType === 'buy' ? acc + order.count : acc - order.count;
            }, 0);

            if (currentHoldings < count) {
                return res.status(400).json({ message: `Insufficient holdings. Only own ${currentHoldings} shares.` });
            }
        }

        if (orderType === 'buy' && trader.balance < valueInINR) {
            return res.status(400).json({ message: 'Insufficient funds.' });
        }

        // 3. EXECUTION
        trader.balance += (orderType === 'buy' ? -valueInINR : valueInINR);
        await trader.save();

        const order = await Order.create({
            user, symbol, name, price, 
            count: Math.floor(count), 
            totalPrice, stockType, orderType, orderStatus
        });

        // 4. TRIGGER NOTIFICATION
        await Notification.create({
            user: trader._id, 
            type: orderType.toUpperCase(),
            message: `Successfully ${orderType}ed ${count} shares of ${symbol} for ₹${totalPrice.toLocaleString('en-IN')}`,
            read: false
        });

        res.status(201).json({ order, newBalance: trader.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrders, addOrder };