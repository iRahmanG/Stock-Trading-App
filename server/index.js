const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
const userRoute = require('./routes/userRoute');
app.use('/api/users', userRoute);

// Basic test route
app.get('/', (req, res) => {
    res.send('Trading App API is running...');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});