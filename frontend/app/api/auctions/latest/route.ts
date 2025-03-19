// frontend/app/api/auctions/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://api.carmandi.com.pk/api/listings/latest');
        const listings = await response.json();
        //console.log("Listings:", listings);
        return NextResponse.json(listings);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: 'Failed to fetch latest listings' }, { status: 500 });
    }
}
