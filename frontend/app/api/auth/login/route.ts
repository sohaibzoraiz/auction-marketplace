import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Secret key for signing JWT tokens (use environment variables in production)
if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY environment variable is not set');
}
const secretKey = process.env.SECRET_KEY;

// Mock user data (replace with actual database queries)
const users = [
    { id: 1, email: 'user@example.com', password: 'password123' },
];

const validateCredentials = (email: string, password: string): boolean => {
    return users.some(user => user.email === email && user.password === password);
};

const generateToken = (email: string): string => {
    const payload = { email };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!validateCredentials(email, password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(email);

        // Return JWT token upon successful authentication
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
}
