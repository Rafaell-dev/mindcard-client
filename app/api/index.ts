type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  query?: Record<string, string | number | boolean>;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

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

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, query, ...rest } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
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
    headers: { ...headers, ...rest.headers },
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

export const api = {
  get: <T>(path: string, query?: Record<string, string | number | boolean>) =>
    apiFetch<T>(path, { method: "GET", query }),

  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body }),

  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body }),

  del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),

  baseUrl: BASE_URL,
};

export default api;
