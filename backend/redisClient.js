// redisClient.js
const redis = require('redis');

const redisClient = redis.createClient({
  // Use environment variables or defaults
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  // Uncomment and set if you have a password
  // password: process.env.REDIS_PASSWORD,
});

// Handle connection events
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
});

module.exports = redisClient;
