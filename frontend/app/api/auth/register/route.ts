import { NextApiRequest, NextApiResponse } from 'next';

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, contactNumber, email, completeAddress, identificationNumber, password } = req.body;

    if (!name || !contactNumber || !email || !completeAddress || !identificationNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = jwt.sign(password, process.env.JWT_SECRET as string);

        const newUser = await prisma.user.create({
            data: {
                name,
                contactNumber,
                email,
                completeAddress,
                identificationNumber,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h',
        });

        res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}