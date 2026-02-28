const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    user: { type: String, required: true }, // Links to the user's email or ID
    symbol: { type: String, required: true }, // e.g., AAPL
    name: { type: String, required: true }, // e.g., Apple Inc.
    price: { type: Number, required: true }, // Purchase price
    count: { type: Number, required: true }, // Quantity owned
    totalPrice: { type: Number, required: true },
    stockExchange: { type: String, required: true } // e.g., NASDAQ
}, {
    timestamps: true
});

module.exports = mongoose.model('Stock', stockSchema);