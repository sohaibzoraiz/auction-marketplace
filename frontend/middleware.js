// middleware.js
import { NextResponse } from 'next/server';

const HARDCODED_PASSWORD = '1234'; // change this to your desired password

export function middleware(req) {
  // Bypass authentication in production (adjust as needed)

    /*const token = localStorage.getItem("accessToken");
    if (token) {
      return NextResponse.next();
    }*/

  // Check if user is already authenticated via cookie
  const cookie = req.cookies.get('authenticated');
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
    // If correct, set a cookie to avoid repeated prompts
    const response = NextResponse.next();
    response.cookies.set('authenticated', 'true', { path: '/' });
    return response;
  }

  return unauthorizedResponse;
}

// Apply the middleware to all routes
export const config = {
  matcher: '/:path*',
};
