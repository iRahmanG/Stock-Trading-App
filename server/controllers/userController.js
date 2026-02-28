const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Order = require('../models/orderSchema');
const Notification = require('../models/notificationModel'); // Added missing import

// Helper function to generate a JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
    try {
        const { username, email, usertype, password } = req.body;
        if (!username || !email || !usertype || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            usertype,
            password: hashedPassword,
            balance: 10000 
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                balance: user.balance,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user (Login)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.status === 'Suspended') {
            return res.status(403).json({ message: "Your account has been suspended by an administrator." });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                balance: user.balance,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    User self-deposit funds
const depositFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.user._id);

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid deposit amount" });
        }

        user.balance += Number(amount);
        await user.save();

        // 1. Trigger Notification
        await Notification.create({
            user: user._id,
            type: 'DEPOSIT',
            message: `Wallet Recharge Successful: ₹${amount.toLocaleString('en-IN')} has been added to your available cash.`,
            read: false
        });

        // 2. Create Ledger Record
        await Order.create({
            user: user.email,
            symbol: 'DEPOSIT',
            name: 'Wallet Top-up',
            price: Number(amount),
            count: 1,
            totalPrice: Number(amount),
            orderType: 'buy', 
            orderStatus: 'settled',
            stockType: 'Cash'
        });

        res.json({ message: "Deposit successful", newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, depositFunds };