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

        // Generate JWT tokens
        const jwtSecret = process.env.JWT_SECRET;
        
        // Check if JWT_SECRET is defined
        if (!jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }

        const accessToken = jwt.sign({
            userId: existingUserQuery.rows[0].id,
            name: existingUserQuery.rows[0].name,
            email: existingUserQuery.rows[0].email_address
        }, jwtSecret, { expiresIn: '1h' });

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

    

module.exports={register ,login};
