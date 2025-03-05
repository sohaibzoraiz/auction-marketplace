import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { name, email, password, contactNumber, completeAddress, identificationNumber } = await request.json();

        // Proxy registration request to your backend API
        const response = await fetch('http://51.20.6.53:3000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                password,
                contactNumber,
                completeAddress,
                identificationNumber
            }),
        });

        // Handle response from backend
        if (response.status === 201) {
            return NextResponse.json(response.json(), { status: 201 });
        } else {
            throw new Error('Failed to register');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
