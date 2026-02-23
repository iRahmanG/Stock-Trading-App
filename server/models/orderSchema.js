const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: String, required: true },
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    stockType: { type: String, required: true }, // intraday / delivery
    orderType: { type: String, required: true }, // buy / sell
    orderStatus: { type: String, required: true } // e.g., Completed, Pending
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);