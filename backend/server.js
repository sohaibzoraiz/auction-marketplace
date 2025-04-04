const path = require('path'); // Make sure to include this at the top if you haven't already
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
//const { Pool } = require('pg');
const pool = require('./db');  // Use the new db.js file
const { getUser } = require('./controllers/auth');
const authMiddleware = require('./middleware/authMiddleware');
const multer = require('multer');
//const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
// Replace local multer setup with S3 upload middleware
const upload = require('./s3upload');

console.log("AWS_S3_BUCKET:", process.env.AWS_S3_BUCKET);




const app = express();
const port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ['https://www.carmandi.com.pk', 'https://carmandi.com.pk'],
    credentials: true,
    optionsSuccessStatus: 200,
  }));

const server = http.createServer(app);

const socketHandler = require('./socket');
const io = socketHandler(server);

/* PostgreSQL connection setup
const pool = new Pool({
  user: 'auction_user',
  host: 'localhost',
  database: 'car_auction',
  password: 'Zoraiz1!',
  port: 5432,
});

// Test the database connection*/
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
  } else {
    console.log('PostgreSQL connected', res.rows);
  }
});

//module.exports = pool;

// Sample route for testing
app.get('/', (req, res) => {
  res.send('<h1>Hello, Car Auction Marketplace!</h1>');
});

// Authentication routes
app.post('/auth/login', require('./controllers/auth').login);
app.post('/auth/register', upload.fields([{ name: 'profile_picture', maxCount: 1 }, { name: 'id_image', maxCount: 1 }]), async (req, res) => {
  try {
    await require('./controllers/auth').register(req, res);
  } catch (error) {
    console.error('Error in register route:', error);
    res.status(500).json({ message: "Error processing registration" });
  }
});
app.post('/api/auth/validate-email-phone', require('./controllers/auth').validateEmailPhone);
app.get('/api/auth/user', authMiddleware, getUser);
app.post('/auth/logout', require('./controllers/auth').logout);
  

// API routes for listings
app.get('/api/listings/featured', require('./controllers/carController').getFeaturedAuctionListings);
app.get('/api/listings/latest', require('./controllers/carController').getLatestListings);

// API routes for auctions
app.get('/api/auctions', require('./controllers/carController').getAllAuctionListings);
app.get('/api/auctions/single', require('./controllers/carController').getSingleAuctionListing);
app.get("/api/auctions/bid-history", require('./controllers/carController').getBidHistory);
app.put('/api/auctions/:id', require('./controllers/carController').updateAuctionListing);
app.delete('/api/auctions/:id', require('./controllers/carController').deleteAuctionListing);

//API routes for creating listing for images
/*const upload = multer({
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
]), authMiddleware, require('./controllers/carController').createAuctionListing);

//serve images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
*/
app.post('/api/auctions/create', 
  upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'carImages', maxCount: 10 }
  ]), 
  authMiddleware, 
  require('./controllers/carController').createAuctionListing
);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
