// frontend/app/api/auctions/create/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Authorization header is missing');
        }
        const token = authHeader.replace('Bearer ', '');
        const body = await req.json(); // Parse the request body

        const response = await fetch('http://localhost:3000/api/auctions/create', {
            method: 'POST',
            body: JSON.stringify(body), // Ensure body is stringified
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include token in headers
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const newAuction = await response.json();
        return NextResponse.json(newAuction, { status: 201 });

    } catch (error) {
        console.error("Error creating auction:", error);
        return NextResponse.json({ message: 'Failed to create auction' }, { status: 500 });
    }
}
