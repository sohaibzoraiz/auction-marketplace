// frontend/app/api/auctions/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.carmandi.com.pk/api/auctions');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const auctions = await response.json();
        return NextResponse.json(auctions);

    } catch (error) {
        console.error("Error fetching all auctions:", error);
        return NextResponse.json({ message: 'Failed to fetch all auctions' }, { status: 500 });
    }
}
