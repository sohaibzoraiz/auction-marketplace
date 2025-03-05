require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { getUser } = require('./controllers/auth');
const authMiddleware = require('./middleware/authMiddleware');
const multer = require('multer');
const path = require('path');



const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const socketHandler = require('./socket');
const socketIo = require('socket.io');


app.use(express.json());
app.use(cors({ origin: 'https://www.carmandi.com.pk/' })); // Adjust origin as needed

const io = socketHandler(http);

http.listen(4000, () => {
    console.log('Server listening on port 4000');
});
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
//app.get('/api/listings/featured', require('./controllers/carController').getFeaturedAuctionListings);
app.get('/api/listings/featured', async (req, res) => {
    try {
      const listings = await require('./controllers/carController').getFeaturedAuctionListings(req, res);
      res.json(listings);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      res.status(500).json({ message: 'Failed to fetch featured listings' });
    }
  });
  
// API routes for auctions
app.get('/api/auctions', require('./controllers/carController').getAllAuctionListings);
app.get('/api/auctions/single', require('./controllers/carController').getSingleAuctionListing);
//app.post('/api/auctions/create', authMiddleware, require('./controllers/carController').createAuctionListing);
app.put('/api/auctions/:id', require('./controllers/carController').updateAuctionListing);
app.delete('/api/auctions/:id', require('./controllers/carController').deleteAuctionListing);

//API routes for creating listing for images
const upload = multer({
    dest: './uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(undefined, true);
    }
});

app.post('/api/auctions/create', upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'carImages', maxCount: 10 }
]),authMiddleware, require('./controllers/carController').createAuctionListing);

//serve images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
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
