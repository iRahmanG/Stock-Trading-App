const express = require('express');
const router = express.Router();
const { getStocks, addStock } = require('../controllers/stockController');

// Define the routes
router.route('/')
    .get(getStocks)
    .post(addStock);

module.exports = router;