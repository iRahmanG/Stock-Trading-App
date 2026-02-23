const Stock = require('../models/stocksSchema');

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Public (or Private if you only want logged-in users to see)
const getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new stock (Admin/System use)
// @route   POST /api/stocks
// @access  Public (For testing purposes)
const addStock = async (req, res) => {
    try {
        const { user, symbol, name, price, count, totalPrice, stockExchange } = req.body;

        const stock = await Stock.create({
            user,
            symbol,
            name,
            price,
            count,
            totalPrice,
            stockExchange
        });

        res.status(201).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStocks, addStock };