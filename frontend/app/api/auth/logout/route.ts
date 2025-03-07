import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Forward the user’s cookies from the request
    const cookieHeader = req.headers.get('cookie') || '';

    // Call your backend’s logout endpoint to clear cookies
    const backendResponse = await fetch('https://api.carmandi.com.pk/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        cookie: cookieHeader, // Pass the cookies along
      },
    });

    if (!backendResponse.ok) {
      return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }

    // Forward any 'Set-Cookie' headers from backend to client
    const data = await backendResponse.json();
    const setCookieHeader = backendResponse.headers.get('set-cookie');

    // Construct the NextResponse
    const response = NextResponse.json(data, { status: backendResponse.status });
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
