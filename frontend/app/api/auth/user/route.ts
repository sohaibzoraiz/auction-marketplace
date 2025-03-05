// app/api/auth/user/route.ts

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
    const token = req.headers.get('Authorization');
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await axios.get('https://api.carmandi.com.pk/api/auth/user', {
            headers: { Authorization: token },
        });

        if (response.status !== 200) {
            throw new Error('Failed to fetch user data');
        }

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
    }
}
