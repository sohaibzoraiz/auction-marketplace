require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
