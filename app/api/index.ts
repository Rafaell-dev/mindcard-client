"use server";

import { cookies } from "next/headers";
import { ENV } from "../config/env";

const BASE_URL = ENV.API_BASE_URL;
const COOKIE_NAME = ENV.COOKIE_NAME;

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean>;
  skipAuth?: boolean;
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

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    body,
    query,
    headers: customHeaders,
    skipAuth = false,
    ...rest
  } = options;

  const authHeaders = skipAuth ? {} : await getAuthHeaders();

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...authHeaders,
    ...(customHeaders as Record<string, string>),
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
    credentials: "include",
    ...rest,
    body: payload,
    headers,
  });
  console.log(res);
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
 * Generic API Client - Server Actions
 * Note: By default this now includes auth headers if available in standard server actions context.
 * These are exported as individual async functions to comply with "use server" requirements.
 */

export async function apiGet<T>(
  path: string,
  query?: Record<string, string | number | boolean>,
  headers?: Record<string, string>
): Promise<T> {
  return apiFetch<T>(path, { method: "GET", query, headers });
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiFetch<T>(path, { method: "POST", body, headers });
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<T> {
  return apiFetch<T>(path, { method: "PATCH", body, headers });
}

export async function apiDel<T>(
  path: string,
  headers?: Record<string, string>
): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE", headers });
}
