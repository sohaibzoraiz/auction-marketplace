// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
 

  const auth = req.headers.get('authorization');
  const unauthorizedResponse = new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' }
  });

  if (!auth) {
    return unauthorizedResponse;
  }

  // Basic Auth header is in the form: "Basic base64(username:password)"
  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString();
  // Since we're ignoring the username, we only care about the password
  const [, password] = credentials.split(':');

  // Hardcoded password (temporary)
  const HARDCODED_PASSWORD = '123'; // change this to your desired password

  if (password === HARDCODED_PASSWORD) {
    return NextResponse.next();
  }

  return unauthorizedResponse;
}

export const config = {
  matcher: '/:path*', // apply to all routes
};
