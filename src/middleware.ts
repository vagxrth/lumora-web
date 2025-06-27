import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()) || [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
]

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const protectedRoutes = ['/dashboard', '/payment']

/**
 * Validates the session token by checking with better-auth
 * @param request - The NextRequest object containing headers and cookies
 * @returns Promise<boolean> - true if session is valid, false otherwise
 */
async function validateSessionToken(request: NextRequest): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    
    return !!session?.user;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowedOrigin = allowedOrigins.includes(origin)
  const { pathname } = request.nextUrl;

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Validate session token for protected routes and auth redirects
  const hasValidSession = await validateSessionToken(request);

  // Redirect to sign-in if accessing protected route without valid session
  if (isProtectedRoute && !hasValidSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect to dashboard if accessing auth pages with valid session
  if (hasValidSession && ["/auth/signin", "/auth/signup"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Handle simple requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/auth/:path*"],
};