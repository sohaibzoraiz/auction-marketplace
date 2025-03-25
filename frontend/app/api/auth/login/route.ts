import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Proxy login request to your backend API
    const backendResponse = await fetch('https://api.carmandi.com.pk/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      // Optionally, if needed:
       credentials: 'include',
    });

    const data = await backendResponse.json();

    // Create NextResponse with the backend response data
    const response = NextResponse.json(data, { status: backendResponse.status });

    // Forward the 'set-cookie' header from the backend to the client
    const setCookieHeader = backendResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

