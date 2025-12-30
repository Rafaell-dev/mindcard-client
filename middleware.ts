import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ENV } from "./app/config/env";

const COOKIE_NAME = ENV.COOKIE_NAME;

// Routes that don't require authentication
const publicRoutes = [
  "/login",
  "/register",
  "/no-account",
  "/auth/callback",
  "/forgot-password",
];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/register", "/no-account"];

/**
 * Decodes a JWT token to check expiration.
 * Returns the payload if valid, null if expired or invalid.
 */
function decodeAndValidateJwt(
  token: string
): { sub: string; exp: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64 URL decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null; // Token expired
    }

    return decoded;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Validate token
  const session = token ? decodeAndValidateJwt(token) : null;
  const isAuthenticated = !!session;

  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("redirect", pathname);

    // Delete expired cookie if exists
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete(COOKIE_NAME);
    }
    return response;
  }

  // If user is authenticated and trying to access auth routes (login, register)
  // Redirect them to home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)",
  ],
};
