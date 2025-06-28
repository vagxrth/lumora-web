import { NextRequest, NextResponse } from "next/server";

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
 * Checks if user has auth cookies (lightweight session check)
 * @param request - The NextRequest object containing cookies
 * @returns boolean - true if auth cookies are present
 */
function hasAuthCookies(request: NextRequest): boolean {
  // Check for better-auth session cookies
  const sessionCookie = request.cookies.get('better-auth.session_token');
  const csrfCookie = request.cookies.get('better-auth.csrf_token');
  
  return !!(sessionCookie && sessionCookie.value);
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
  
  // Check for auth cookies (lightweight check to avoid Prisma in Edge Runtime)
  const hasAuthSession = hasAuthCookies(request);

  // Redirect to sign-in if accessing protected route without auth cookies
  if (isProtectedRoute && !hasAuthSession) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect to dashboard if accessing auth pages with auth cookies
  if (hasAuthSession && ["/auth/signin", "/auth/signup"].includes(pathname)) {
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