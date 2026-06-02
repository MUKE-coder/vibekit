import { createHmac, timingSafeEqual } from "crypto";

/**
 * Generic HMAC signature verifier for inbound webhooks. Use it once and
 * reuse across every provider (Resend, Slack, custom partners, internal
 * service-to-service).
 *
 *   const isValid = verifyHmacSignature({
 *     payload: rawBody,
 *     signature: req.headers.get("x-webhook-signature"),
 *     secret: env.WEBHOOK_SECRET,
 *     algorithm: "sha256",
 *   });
 *   if (!isValid) return new Response("Bad signature", { status: 401 });
 *
 * Stripe is special — its SDK has `stripe.webhooks.constructEvent()`
 * which handles timestamp + replay protection. Use that for Stripe and
 * this helper for everything else.
 *
 * KEY GOTCHA: the framework's master_prompt.md says webhook routes must
 * read the body with `await req.text()` (NOT `req.json()`) BEFORE
 * verifying. Hashing the parsed-then-re-serialised body breaks the
 * signature because the byte order is implementation-defined.
 */

type Algorithm = "sha256" | "sha512" | "sha1";

interface VerifyHmacInput {
  /** Raw request body string (await req.text(), NOT req.json()). */
  payload: string;
  /** Signature from the request header. Optionally prefixed (e.g. `sha256=...`). */
  signature: string | null | undefined;
  /** Shared secret from the provider. */
  secret: string;
  /** Hash algorithm. Default: "sha256". */
  algorithm?: Algorithm;
  /** Encoding of the signature. Default: "hex". */
  encoding?: "hex" | "base64";
  /** Strip a leading prefix (e.g. `sha256=`) before comparison. Default: auto-detect. */
  stripPrefix?: boolean;
}

export function verifyHmacSignature({
  payload,
  signature,
  secret,
  algorithm = "sha256",
  encoding = "hex",
  stripPrefix = true,
}: VerifyHmacInput): boolean {
  if (!signature) return false;

  let sig = signature;
  if (stripPrefix) {
    const eqIndex = sig.indexOf("=");
    if (eqIndex !== -1 && eqIndex < 16) sig = sig.slice(eqIndex + 1);
  }

  const expected = createHmac(algorithm, secret).update(payload, "utf8").digest(encoding);

  // Constant-time comparison — guards against timing-attack signature leaks
  const a = Buffer.from(sig, encoding);
  const b = Buffer.from(expected, encoding);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Convenience wrapper that throws a 401 Response on failure — fits the
 * route-handler early-return style:
 *
 *   const body = await req.text();
 *   requireHmacSignature({ payload: body, signature: ..., secret: ... });
 *   const event = JSON.parse(body);
 *   // ... handle the event
 */
export class WebhookVerificationError extends Error {
  status = 401;
  constructor(message = "Invalid webhook signature") {
    super(message);
    this.name = "WebhookVerificationError";
  }
}

export function requireHmacSignature(input: VerifyHmacInput): void {
  if (!verifyHmacSignature(input)) throw new WebhookVerificationError();
}
