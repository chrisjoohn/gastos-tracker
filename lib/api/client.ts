export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_BASE_URL = "http://localhost:3001/api";

function getApiBaseUrl() {
  const configuredBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.API_BASE_URL;

  return (configuredBaseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
}

function buildUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("auth_token");
}

export function setApiAuthToken(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem("auth_token", token);
    return;
  }

  window.localStorage.removeItem("auth_token");
}

async function parseError(response: Response) {
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (payload && typeof payload === "object" && "error" in payload) {
    const errorPayload = payload as { error?: { message?: string; code?: string; details?: unknown } };
    return new ApiError(
      errorPayload.error?.message ?? "Request failed",
      response.status,
      errorPayload.error?.code,
      errorPayload.error?.details,
    );
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    const messagePayload = payload as { message?: string; code?: string; details?: unknown };
    return new ApiError(
      messagePayload.message ?? "Request failed",
      response.status,
      messagePayload.code,
      messagePayload.details,
    );
  }

  return new ApiError("Request failed", response.status);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }

  return (await response.text()) as T;
}

export const api = {
  get<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: "GET" });
  },
  post<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, {
      ...init,
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },
  put<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, {
      ...init,
      method: "PUT",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },
  patch<T>(path: string, body?: unknown, init?: RequestInit) {
    return request<T>(path, {
      ...init,
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },
  delete<T>(path: string, init?: RequestInit) {
    return request<T>(path, { ...init, method: "DELETE" });
  },
};
