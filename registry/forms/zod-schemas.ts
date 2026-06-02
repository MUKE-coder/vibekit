import { z } from "zod";

/**
 * Common reusable Zod schemas. Import the pieces you need so every
 * form / API route validates against the same canonical rules:
 *
 *   import { emailSchema, passwordSchema, slugSchema, phoneSchema } from "@/lib/zod-schemas";
 *
 *   export const SignupSchema = z.object({
 *     email: emailSchema,
 *     password: passwordSchema,
 *     name: nameSchema,
 *   });
 *
 * Every schema includes a sensible `.trim()`/normalisation step so
 * server + client agree on the stored value. Error messages are
 * human-readable — drop into RHF with `zodResolver` and they render
 * as-is.
 */

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254, "Email is too long");

export const passwordSchema = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Maximum 72 characters")
  .refine((value) => /[a-z]/.test(value), "Include a lowercase letter")
  .refine((value) => /[A-Z]/.test(value), "Include an uppercase letter")
  .refine((value) => /\d/.test(value), "Include a number");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name is too long");

/** URL-safe slug — letters, digits, hyphens; auto-lowercased. */
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Slug is required")
  .max(64, "Slug is too long")
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, "Only lowercase letters, numbers, and hyphens");

/** E.164-ish phone (loose) — accepts +1 234 567 89 etc. and strips formatting. */
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()\-.]/g, ""))
  .pipe(z.string().regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid phone number"));

export const urlSchema = z
  .string()
  .trim()
  .min(1, "URL is required")
  .url("Enter a valid URL")
  .max(2048, "URL is too long");

/** Optional URL — allows empty string AND undefined, otherwise strict. */
export const optionalUrlSchema = z
  .union([z.literal(""), z.undefined(), urlSchema])
  .transform((value) => (value === "" ? undefined : value));

export const positiveIntSchema = z
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than zero");

export const moneySchema = z
  .number()
  .nonnegative("Must be zero or more")
  .max(1_000_000_000, "Amount is too large");

export const hexColorSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/, "Use a #RRGGBB or #RGB hex value");

/**
 * Helper for paginated list endpoints. Use as `parseSearchParams(req, listQuerySchema)`.
 *
 *   z.object({
 *     page: z.coerce.number().min(1).default(1),
 *     pageSize: z.coerce.number().min(1).max(100).default(20),
 *     q: z.string().trim().optional(),
 *     sort: z.string().optional(),
 *     dir: z.enum(["asc","desc"]).default("desc"),
 *   })
 */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  sort: z.string().trim().optional(),
  dir: z.enum(["asc", "desc"]).default("desc"),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

/** CSV-of-IDs query param. `?ids=a,b,c` → ["a","b","c"], trimmed + deduped. */
export const csvIdsSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => Array.from(new Set(value.split(",").map((s) => s.trim()).filter(Boolean))));
