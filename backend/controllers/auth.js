// File Path: controllers/auth.js

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL connection setup (adjust as needed)
const pool = new Pool({
    user: 'auction_user',
    host: 'localhost',
    database: 'car_auction',
    password: 'Zoraiz1!',
    port: 5432,
});

async function register(req, res) {
    try {
        const { name, contactNumber, email, completeAddress, identificationNumber, password } = req.body;

        // Additional validation checks here...

        if (!name || !contactNumber || !email || !completeAddress || !identificationNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const existingUserQuery = await pool.query("SELECT * FROM users WHERE email_address=$1", [email]);

        if (existingUserQuery.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        let hashedPassword = await bcrypt.hash(password.trim(), 10);

        // Insert new user into database with hashed password
        let result = await pool.query(
            "INSERT INTO users(name , contact_number , email_address , complete_address , identification_number,password )VALUES($1,$2,$3,$4,$5,$6 )RETURNING*",
            [name.trim(), contactNumber.trim(), email.trim(), completeAddress.trim(), identificationNumber.trim(), hashedPassword]
        );

        const userId = result.rows[0].id;

        // Insert default subscription entry
        const defaultPlan = 'Basic';
        const startDate = new Date();
        const endDate = null; // Basic plan never expires

        await pool.query(
            "INSERT INTO subscriptions(user_id, subscription_plan_name, subscription_start_date, subscription_end_date) VALUES($1, $2, $3, $4)",
            [userId, defaultPlan, startDate, endDate]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
}



const jwt = require('jsonwebtoken');

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const existingUserQuery = await pool.query("SELECT * FROM users WHERE email_address=$1", [email]);

        if (existingUserQuery.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare passwords
        let isValidPassword = await bcrypt.compare(password.trim(), existingUserQuery.rows[0].password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Fetch subscription plan
        const subscriptionQuery = "SELECT subscription_plan_name FROM subscriptions WHERE user_id=$1 ORDER BY subscription_end_date DESC NULLS LAST LIMIT 1";
        const subscriptionResult = await pool.query(subscriptionQuery, [existingUserQuery.rows[0].id]);

        let userPlan = 'Basic'; // Default plan if no subscription found

        if (subscriptionResult.rows.length > 0) {
            userPlan = subscriptionResult.rows[0].subscription_plan_name;
        }

        // Generate JWT tokens
        const jwtSecret = process.env.JWT_SECRET;

        // Check if JWT_SECRET is defined
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        const accessToken = jwt.sign({
            userId: existingUserQuery.rows[0].id,
            name: existingUserQuery.rows[0].name,
            email: existingUserQuery.rows[0].email_address,
            userPlan: userPlan // Include userPlan
        }, jwtSecret, { expiresIn: '30d' });

        const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || jwtSecret; // Use jwtSecret if refreshTokenSecret is not defined
        const refreshToken = jwt.sign({
            userId: existingUserQuery.rows[0].id
        }, refreshTokenSecret, { expiresIn: '30d' });

        return res.json({
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error(error);

        // Return JSON error response
        res.status(500).json({ message: "Server Error" });
    }
}

async function getUser(req, res) {
    try {
        const userId = req.user.userId;

        // Fetch user data
        const userQuery = "SELECT * FROM users WHERE id=$1";
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = userResult.rows[0];

        // Fetch subscription plan
        const subscriptionQuery = "SELECT subscription_plan_name FROM subscriptions WHERE user_id=$1 ORDER BY subscription_end_date DESC NULLS LAST LIMIT 1";
        const subscriptionResult = await pool.query(subscriptionQuery, [userId]);

        let subscriptionPlan = 'Basic'; // Default plan if no subscription found

        if (subscriptionResult.rows.length > 0) {
            subscriptionPlan = subscriptionResult.rows[0].subscription_plan_name;
        }

        // Include subscription plan in response
        const userData = {
            ...user,
            plan: subscriptionPlan,
        };

        return res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}


async function upgradeSubscription(req, res) {
    try {
        const userId = req.user.userId;
        const planName = req.body.planName;
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // One year from now

        await pool.query(
            "INSERT INTO subscriptions(user_id, subscription_plan_name, subscription_start_date, subscription_end_date) VALUES($1, $2, $3, $4)",
            [userId, planName, startDate, endDate]
        );

        res.json({ message: "Subscription upgraded successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
}

module.exports={register ,login, getUser, upgradeSubscription};
