require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const express = require('express');
const { Pool } = require('pg');
const authController = require('./controllers/auth');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;

// Get User
const { getUser } = require('./controllers/auth');
// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from your frontend
}));

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432, // Default PostgreSQL port
});

// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('PostgreSQL connection error:', err);
    } else {
        console.log('PostgreSQL connected', res.rows);
    }
});

// Sample route for testing
app.get('/', (req, res) => {
    res.send('<h1>Hello, Car Auction Marketplace!</h1>');
});

// Authentication routes
app.post('/auth/login', authController.login);
app.post('/auth/register', authController.register);

//Get User Details
app.get('/api/auth/user', authMiddleware, async (req, res) => {
    await getUser(req, res);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
