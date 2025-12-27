"use server";

import { cookies } from "next/headers";
import { ENV } from "../config/env";

const COOKIE_NAME = ENV.COOKIE_NAME;

export type Session = {
  userId: string;
  email: string;
  token: string;
} | null;

/**
 * Decodes a JWT token without verification (for client-side use only).
 * The token was already verified by the backend when issued.
 */
function decodeJwt(token: string): { sub: string; email: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    // Base64 URL decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Gets the current user session from the token cookie.
 * Use this in server components to get the authenticated user.
 */
export async function getSession(): Promise<Session> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const decoded = decodeJwt(token);

  if (!decoded) {
    return null;
  }

  return {
    userId: decoded.sub,
    email: decoded.email,
    token,
  };
}

/**
 * Gets the current user ID from session.
 * Convenience function for when you only need the user ID.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId ?? null;
}

/**
 * Gets the auth token for making authenticated API requests.
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}
