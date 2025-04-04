// socket.js
//const { Pool } = require('pg');
const pool = require('./db.js');
const io = require('socket.io');
const axios = require('axios');
const cookie = require('cookie');
const jwt = require('jsonwebtoken'); // Ensure jwt is required here (already used elsewhere)

/* PostgreSQL connection setup
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432,
});
*/
const socketHandler = (httpServer) => {
    const ioInstance = io(httpServer, {
        cors: {
          origin: ['https://www.carmandi.com.pk', 'https://carmandi.com.pk'],
          methods: ['GET', 'POST'],
          credentials: true,
        },
      });
      
    // Middleware to authenticate users
    /*const authenticate = async (socket, next) => {
        const accessToken = socket.handshake.auth.accessToken;
        if (!accessToken) {
            return next(new Error('Unauthorized'));
        }

        try {
            const userData = await axios.get('https://api.carmandi.com.pk/api/auth/user', {
                headers: {
                    Authorization: accessToken,
                },
            });
            socket.handshake.auth.userId = userData.data.id;
            socket.handshake.auth.userPlan = userData.data.plan;
            next();
        } catch (error) {
            console.error('Error authenticating user:', error);
            return next(new Error('Unauthorized'));
        }
    };*/
    const authenticate = (socket, next) => {
        // Parse cookies from the socket's request headers
        const cookies = cookie.parse(socket.request.headers.cookie || '');
        const accessToken = cookies.accessToken;
        
        // If no token, allow connection as guest
        if (!accessToken) {
            socket.handshake.auth.userId = null;  // mark as guest
            socket.handshake.auth.userPlan = 'guest';
            return next();
        }
    
        try {
            // Verify the token using your JWT secret
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
            // Attach decoded user info to socket handshake
            socket.handshake.auth.userId = decoded.userId;
            socket.handshake.auth.userPlan = decoded.userPlan;
            next();
        } catch (error) {
            console.error('Error authenticating user:', error);
            // If token is invalid, still allow as guest
            socket.handshake.auth.userId = null;
            socket.handshake.auth.userPlan = 'guest';
            next();
        }
    };
    
    

    ioInstance.use(authenticate);

    ioInstance.on('connection', (socket) => {
        console.log('Client connected');
        socket.on('place-bid', async (bidData) => {
            console.log('Received bid data:', bidData);
            const { auctionId, amount} = bidData;
            const userId = socket.handshake.auth.userId;
            const userPlan = socket.handshake.auth.userPlan;
            if (!socket.handshake.auth.userId) {
                socket.emit('error', 'You must be logged in to place a bid.');
                return;
            }
            // Check if user has free bids (if basic plan)
            if (userPlan === 'basic') {
                const freeBids = await pool.query('SELECT free_bids FROM users WHERE id = $1', [userId]);
                if (freeBids.rows[0].free_bids <= 0) {
                    socket.emit('error', 'You have no free bids left.');
                    return;
                }
            }

            try {
                
                // Update auctions table
                const currentBid = await pool.query('SELECT current_bid FROM auctions WHERE car_id = $1', [auctionId]);
                if (amount <= currentBid.rows[0].current_bid) {
                    socket.emit('error', 'Bid must be higher than the current bid.');
                    return;
                }
                await pool.query('UPDATE auctions SET current_bid = $1 WHERE car_id = $2', [amount, auctionId]);
                // Update bids table
                await pool.query('INSERT INTO bids (car_id, user_id, amount, created_at) VALUES ($1, $2, $3, NOW())', [auctionId, userId, amount]);

                // Update user table (if basic plan)
                if (userPlan === 'basic') {
                    await pool.query('UPDATE users SET free_bids = free_bids - 1 WHERE id = $1', [userId]);
                }

                // Emit new bid to all connected clients
                ioInstance.emit('new-bid', { auctionId, amount });
            } catch (error) {
                console.error('Error processing bid:', error);
                socket.emit('error', 'Failed to process bid.');
            }
        });
       
    });

    return ioInstance;
};

module.exports = socketHandler;