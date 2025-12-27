"use server";

import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const COOKIE_NAME = "token";

type FetchOptions = {
  body?: unknown;
  query?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  skipAuth?: boolean; // Set to true for public endpoints
};

function buildUrl(
  path: string,
  query?: Record<string, string | number | boolean>
) {
  const url = new URL(`${BASE_URL}/${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  return url.toString();
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function authApiFetch<T>(
  path: string,
  method: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, query, headers: customHeaders, skipAuth = false } = options;

  // Build headers - auto-include auth unless skipAuth is true
  const authHeaders = skipAuth ? {} : await getAuthHeaders();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...authHeaders,
    ...customHeaders,
  };

  let payload: BodyInit | undefined;

  // Prepare body
  if (body) {
    if (body instanceof FormData) {
      payload = body as BodyInit;
    } else if (typeof body === "object") {
      headers["Content-Type"] = "application/json";
      payload = JSON.stringify(body);
    } else {
      payload = String(body);
    }
  }

  // Fetch
  const res = await fetch(buildUrl(path, query), {
    method,
    credentials: "include",
    body: payload,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    const error = new Error(`API Error: ${res.status}`) as Error & {
      status?: number;
      data?: unknown;
    };
    error.status = res.status;
    error.data = text;
    throw error;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("json")) {
    const data = await res.json();
    return data as T;
  }
  const text = await res.text();
  return text as unknown as T;
}

/**
 * Authenticated API client - automatically includes Authorization header
 * Use this for protected routes. For public routes, pass { skipAuth: true }
 */
export const authApi = {
  get: <T>(
    path: string,
    query?: Record<string, string | number | boolean>,
    options?: Omit<FetchOptions, "body" | "query">
  ) => authApiFetch<T>(path, "GET", { ...options, query }),

  post: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "body">
  ) => authApiFetch<T>(path, "POST", { ...options, body }),

  patch: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "body">
  ) => authApiFetch<T>(path, "PATCH", { ...options, body }),

  put: <T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "body">
  ) => authApiFetch<T>(path, "PUT", { ...options, body }),

  del: <T>(path: string, options?: Omit<FetchOptions, "body">) =>
    authApiFetch<T>(path, "DELETE", options),

  baseUrl: BASE_URL,
};

export default authApi;
