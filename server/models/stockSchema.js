const mongoose = require('mongoose');

const stocksSchema = new mongoose.Schema({
    user: { type: String, required: true }, 
    symbol: { type: String, required: true }, 
    name: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    count: { type: Number, required: true }, 
    totalPrice: { type: Number, required: true },
    stockExchange: { type: String, required: true } 
}, {
    timestamps: true
});

module.exports = mongoose.model('Stock', stocksSchema);