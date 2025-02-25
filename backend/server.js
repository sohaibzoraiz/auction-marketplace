require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { getUser } = require('./controllers/auth');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001' })); // Adjust origin as needed

// PostgreSQL connection setup
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432,
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
app.post('/auth/login', require('./controllers/auth').login);
app.post('/auth/register', require('./controllers/auth').register);
app.get('/api/auth/user', authMiddleware, getUser);

// API routes for listings
app.get('/api/listings/featured', require('./controllers/carController').getFeaturedAuctionListings);

// API routes for auctions
app.get('/api/auctions', require('./controllers/carController').getAllAuctionListings);
app.post('/api/auctions/create', authMiddleware, require('./controllers/carController').createAuctionListing);
app.put('/api/auctions/:id', require('./controllers/carController').updateAuctionListing);
app.delete('/api/auctions/:id', require('./controllers/carController').deleteAuctionListing);

/* API routes for cars
app.get('/api/cars', require('./controllers/carController').getAllCarListings);
app.post('/api/cars/create', require('./controllers/carController').createCarListing);
app.put('/api/cars/:id', require('./controllers/carController').updateCarListing);
app.delete('/api/cars/:id', require('./controllers/carController').deleteCarListing);
*/
// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
