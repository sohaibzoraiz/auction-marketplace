// middleware.js
import { NextResponse } from 'next/server';

const HARDCODED_PASSWORD = '1234'; // change this to your desired password

export function middleware(req) {
  // Check if user is already authenticated via middleware-specific cookie
  const cookie = req.cookies.get('devAuthenticated');
  if (cookie === 'true') {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization');
  const unauthorizedResponse = new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' }
  });

  if (!auth) {
    return unauthorizedResponse;
  }

  // Decode credentials: format "Basic base64(username:password)"
  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString();
  // We ignore the username and only check the password
  const [, password] = credentials.split(':');

  if (password === HARDCODED_PASSWORD) {
    // If correct, set a cookie to avoid repeated prompts (persisting for 7 days)
    const response = NextResponse.next();
    response.cookies.set('devAuthenticated', 'true', { 
      path: '/', 
      maxAge: 60 * 60 * 24 * 7 // persists for 7 days
    });
    return response;
  }

  return unauthorizedResponse;
}

export const config = {
    matcher: ['/((?!login).*)'], // This excludes any route starting with /login
  };