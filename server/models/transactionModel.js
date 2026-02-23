const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: String, required: true },
    type: { type: String, required: true }, // e.g., Deposit or Withdrawal
    paymentMode: { type: String, required: true },
    amount: { type: Number, required: true },
    time: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);