import { NextResponse } from "next/server";
import { ZodError, type ZodSchema, type z } from "zod";

/**
 * Server-side helper to validate a request body against a Zod schema. Returns
 * either typed data OR a 422 NextResponse with field errors — caller picks
 * the branch that matches its routing style.
 *
 * Two usage patterns:
 *
 * 1) Throw-on-error style (preferred — pair with a route-level error handler):
 *
 *      const body = await parseRequestBody(req, ContactSchema);
 *      // body is fully typed here
 *
 * 2) Result-tuple style (return early, no error boundary needed):
 *
 *      const result = await safeParseRequestBody(req, ContactSchema);
 *      if (!result.ok) return result.response;
 *      const body = result.data;
 *
 * The error response shape matches what RHF + Zod expect on the client:
 *
 *      { error: "Validation failed", issues: [{ path, message }] }
 *
 * Use the SAME Zod schema on the client form so you have one source of truth.
 */

export class ValidationError extends Error {
  status = 422;
  issues: Array<{ path: string; message: string }>;
  constructor(issues: ValidationError["issues"]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.issues = issues;
  }
}

function issuesFromZod(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

/**
 * Parse and validate JSON body. Throws ValidationError (status 422) if invalid.
 */
export async function parseRequestBody<S extends ZodSchema>(
  req: Request,
  schema: S,
): Promise<z.infer<S>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ValidationError([{ path: "", message: "Body must be valid JSON" }]);
  }

  const result = schema.safeParse(body);
  if (!result.success) throw new ValidationError(issuesFromZod(result.error));
  return result.data;
}

/**
 * Result-tuple variant. Returns { ok: true, data } or { ok: false, response }
 * so the caller can early-return without wrapping the route in a try/catch.
 */
export async function safeParseRequestBody<S extends ZodSchema>(
  req: Request,
  schema: S,
): Promise<
  { ok: true; data: z.infer<S> } | { ok: false; response: NextResponse }
> {
  try {
    const data = await parseRequestBody(req, schema);
    return { ok: true, data };
  } catch (err) {
    if (err instanceof ValidationError) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: err.message, issues: err.issues },
          { status: err.status },
        ),
      };
    }
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      ),
    };
  }
}

/**
 * Parse query params against a schema. Same pattern as parseRequestBody.
 *
 *   const { page, q } = parseSearchParams(req, ListQuerySchema);
 */
export function parseSearchParams<S extends ZodSchema>(
  reqOrUrl: Request | URL | string,
  schema: S,
): z.infer<S> {
  const url = reqOrUrl instanceof Request ? new URL(reqOrUrl.url) : new URL(String(reqOrUrl));
  const obj: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  const result = schema.safeParse(obj);
  if (!result.success) throw new ValidationError(issuesFromZod(result.error));
  return result.data;
}
