// frontend/app/api/auctions/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';

export async function PUT(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
        throw new Error('Auction ID is required');
    }
    try {
        const response = await fetch(`https://api.carmandi.com.pk/api/auctions/${id}`, {
            method: 'PUT',
            body: req.body,
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedAuction = await response.json();
        return NextResponse.json(updatedAuction);

    } catch (error) {
        console.error("Error updating auction:", error);
        return NextResponse.json({ message: 'Failed to update auction' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');
    try {
        const response = await fetch(`https://api.carmandi.com.pk/api/auctions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return NextResponse.json({ message: 'Auction deleted successfully' });
    } catch (error) {
        console.error("Error deleting auction:", error);
        return NextResponse.json({ message: 'Failed to delete auction' }, { status: 500 });
    }
}
