import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Proxy login request to your backend API
        const response = await fetch('https://api.carmandi.com.pk/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        // Handle response from backend
        if (response.status === 200) {
            return NextResponse.json(await response.json(), { status: 200 });
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
}
