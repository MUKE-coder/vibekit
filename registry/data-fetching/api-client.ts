/**
 * Typed fetch wrapper. Handles base URL, JSON serialisation, default
 * headers, error normalisation, and abort signals. Drop-in replacement
 * for `fetch` inside React Query / server actions.
 *
 *   const data = await api.get<Invoice[]>("/invoices");
 *   const created = await api.post<Invoice>("/invoices", body);
 *   await api.delete(`/invoices/${id}`);
 *
 * Errors are thrown as `ApiError` instances with `status`, `data`, and
 * `message` populated from the response so React Query's `onError`
 * receives consistent shape.
 */

export class ApiError<T = unknown> extends Error {
  status: number;
  data: T | null;
  constructor(status: number, message: string, data: T | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface ApiClientOptions {
  /** Base URL prepended to every request path. Default: empty (same-origin). */
  baseUrl?: string;
  /** Default headers merged into every request. */
  defaultHeaders?: HeadersInit;
  /** Called before each request — return modified init or null to skip. */
  onRequest?: (path: string, init: RequestInit) => RequestInit | Promise<RequestInit>;
  /** Called on any non-2xx response before ApiError is thrown. */
  onError?: (error: ApiError) => void;
}

type RequestBody = unknown;

interface RequestOpts extends RequestInit {
  /** Skip JSON parsing of the response — return Response instead. */
  raw?: boolean;
  /** Inject query params (object → URLSearchParams). */
  params?: Record<string, string | number | boolean | null | undefined>;
}

export function createApiClient(options: ApiClientOptions = {}) {
  const { baseUrl = "", defaultHeaders, onRequest, onError } = options;

  async function request<T = unknown>(
    method: string,
    path: string,
    body?: RequestBody,
    opts: RequestOpts = {},
  ): Promise<T> {
    const { raw, params, headers: callHeaders, ...rest } = opts;

    let url = baseUrl + path;
    if (params) {
      const sp = new URLSearchParams();
      for (const [k, v] of Object.entries(params)) {
        if (v !== null && v !== undefined) sp.set(k, String(v));
      }
      const qs = sp.toString();
      if (qs) url += (url.includes("?") ? "&" : "?") + qs;
    }

    const init: RequestInit = {
      method,
      credentials: "include",
      ...rest,
      headers: {
        ...(body !== undefined && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...(defaultHeaders as Record<string, string> | undefined),
        ...(callHeaders as Record<string, string> | undefined),
      },
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    };

    const finalInit = onRequest ? await onRequest(path, init) : init;
    const res = await fetch(url, finalInit);

    if (!res.ok) {
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        /* ignore parse errors on error responses */
      }
      const message =
        (data && typeof data === "object" && "error" in data && typeof (data as { error: unknown }).error === "string"
          ? (data as { error: string }).error
          : null) ?? `Request failed: ${res.status} ${res.statusText}`;
      const err = new ApiError(res.status, message, data);
      onError?.(err);
      throw err;
    }

    if (raw) return res as unknown as T;
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  return {
    get: <T = unknown>(path: string, opts?: RequestOpts) => request<T>("GET", path, undefined, opts),
    post: <T = unknown>(path: string, body?: RequestBody, opts?: RequestOpts) =>
      request<T>("POST", path, body, opts),
    put: <T = unknown>(path: string, body?: RequestBody, opts?: RequestOpts) =>
      request<T>("PUT", path, body, opts),
    patch: <T = unknown>(path: string, body?: RequestBody, opts?: RequestOpts) =>
      request<T>("PATCH", path, body, opts),
    delete: <T = unknown>(path: string, opts?: RequestOpts) =>
      request<T>("DELETE", path, undefined, opts),
    request,
  };
}

/** Default app-wide instance. Customise via createApiClient() if you need interceptors. */
export const api = createApiClient({ baseUrl: "/api" });
