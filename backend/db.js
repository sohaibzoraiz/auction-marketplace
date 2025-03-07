// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'auction_user',
  host: 'localhost',
  database: 'car_auction',
  password: 'Zoraiz1!',
  port: 5432,
});

module.exports = pool;
