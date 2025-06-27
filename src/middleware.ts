import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000']

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

const protectedRoutes = ['/dashboard', '/payment']

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

  // Check for session token in cookies (better-auth stores it as "better-auth.session_token")
  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Redirect to sign-in if accessing protected route without session
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect to dashboard if accessing auth pages with valid session
  if (sessionToken && ["/auth/signin", "/auth/signup"].includes(pathname)) {
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