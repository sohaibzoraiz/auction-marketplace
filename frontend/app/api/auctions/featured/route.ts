// frontend/app/api/auctions/featured/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://localhost:3000/api/listings/featured');
        const listings = await response.json();
        //console.log("Listings:", listings);
        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: 'Failed to fetch featured listings' }, { status: 500 });
    }
}
