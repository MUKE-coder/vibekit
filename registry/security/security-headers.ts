import { NextResponse, type NextRequest } from "next/server";

/**
 * Standard security headers + lightweight CSRF guard for state-changing
 * routes. Drop into `middleware.ts` at the project root:
 *
 *   import { withSecurityHeaders } from "@/lib/security-headers";
 *
 *   export function middleware(req: NextRequest) {
 *     return withSecurityHeaders(req, NextResponse.next());
 *   }
 *
 *   export const config = { matcher: "/((?!_next|favicon.ico).*)" };
 *
 * What it sets:
 *   - Content-Security-Policy            (relax via `cspOverrides`)
 *   - Strict-Transport-Security (HSTS)
 *   - X-Content-Type-Options: nosniff
 *   - X-Frame-Options: SAMEORIGIN
 *   - Referrer-Policy: strict-origin-when-cross-origin
 *   - Permissions-Policy (minimal default)
 *
 * CSRF: for any state-changing method (POST/PUT/PATCH/DELETE), the
 * Origin header must match the request host. The browser sets Origin
 * automatically and can't be spoofed by simple form posts. This is the
 * "Same-Origin Origin check" defence, simpler and stronger than a
 * synchronizer token for cookie-authed APIs. Skip for routes you want
 * to expose to third-party clients by adding them to `csrfBypass`.
 */

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

interface SecurityOptions {
  /** Extra CSP source overrides merged into the defaults. */
  cspOverrides?: Partial<Record<CspDirective, string[]>>;
  /** Paths that bypass the CSRF Origin check (e.g. public webhook endpoints). */
  csrfBypass?: (string | RegExp)[];
  /** HSTS max-age in seconds. Default: 1 year. */
  hstsMaxAge?: number;
}

type CspDirective =
  | "default-src"
  | "script-src"
  | "style-src"
  | "img-src"
  | "font-src"
  | "connect-src"
  | "frame-src"
  | "object-src"
  | "base-uri"
  | "form-action";

const DEFAULT_CSP: Record<CspDirective, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Next.js needs these in dev/prod
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "font-src": ["'self'", "data:"],
  "connect-src": ["'self'", "https:"],
  "frame-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

function buildCsp(overrides: SecurityOptions["cspOverrides"] = {}): string {
  const merged: Record<CspDirective, string[]> = { ...DEFAULT_CSP };
  for (const [key, values] of Object.entries(overrides) as [CspDirective, string[]][]) {
    merged[key] = Array.from(new Set([...(merged[key] ?? []), ...values]));
  }
  return Object.entries(merged)
    .map(([k, v]) => `${k} ${v.join(" ")}`)
    .join("; ");
}

function isCsrfBypassed(pathname: string, patterns: SecurityOptions["csrfBypass"] = []): boolean {
  return patterns.some((p) =>
    typeof p === "string" ? pathname === p || pathname.startsWith(p) : p.test(pathname),
  );
}

/** Extracts just the origin from a Referer header, or null if unusable. */
function refererOrigin(referer: string | null): string | null {
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function withSecurityHeaders(
  req: NextRequest,
  res: NextResponse,
  options: SecurityOptions = {},
): NextResponse {
  // CSRF Origin check
  if (STATE_CHANGING_METHODS.has(req.method) && !isCsrfBypassed(req.nextUrl.pathname, options.csrfBypass)) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    const fetchSite = req.headers.get("sec-fetch-site");

    if (!host) {
      return NextResponse.json({ error: "Bad request: missing host" }, { status: 403 });
    }

    // Fail CLOSED. A missing Origin used to skip the check entirely, which let
    // any client that simply omits the header through — exactly the request an
    // attacker controls. Modern browsers always send Origin on state-changing
    // requests; Sec-Fetch-Site is the fallback signal, and Referer the last one.
    const sourceOrigin = origin ?? refererOrigin(req.headers.get("referer"));

    if (!sourceOrigin) {
      // No Origin and no Referer: only trust an explicit same-origin declaration.
      if (fetchSite !== "same-origin" && fetchSite !== "none") {
        return NextResponse.json(
          { error: "Bad request: missing origin" },
          { status: 403 },
        );
      }
    } else {
      try {
        if (new URL(sourceOrigin).host !== host) {
          return NextResponse.json(
            { error: "Bad request: origin mismatch" },
            { status: 403 },
          );
        }
      } catch {
        return NextResponse.json({ error: "Bad request: invalid origin" }, { status: 403 });
      }
    }
  }

  res.headers.set("Content-Security-Policy", buildCsp(options.cspOverrides));
  res.headers.set("Strict-Transport-Security", `max-age=${options.hstsMaxAge ?? 31536000}; includeSubDomains`);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return res;
}
