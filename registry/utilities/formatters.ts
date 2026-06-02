/**
 * Centralised formatters. Locale + timezone aware. Wrap the Intl APIs so
 * every component has one place to look for currency, date, and number
 * formatting — no more drift between pages.
 *
 *   formatCurrency(1234.5, "USD")           // "$1,234.50"
 *   formatCurrency(15000, "UGX")            // "USh 15,000"
 *   formatDate(new Date(), "long")          // "May 18, 2026"
 *   formatRelativeTime(date)                // "2 hours ago"
 *   formatNumber(1234567)                   // "1,234,567"
 *   formatPercent(0.123)                    // "12%"
 *   formatBytes(1536)                       // "1.5 KB"
 */

const DEFAULT_LOCALE =
  typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US";

// ── Currency ──────────────────────────────────────────────────────────

/**
 * Format `amount` as a currency string. `amount` is the human number
 * (e.g. 12.50 for $12.50), NOT the minor-unit integer. Pass the ISO 4217
 * code as `currency`.
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options: { locale?: string; maximumFractionDigits?: number } = {},
): string {
  const { locale = DEFAULT_LOCALE, maximumFractionDigits } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(amount);
}

// ── Date ──────────────────────────────────────────────────────────────

type DateStyle = "short" | "medium" | "long" | "full";

export function formatDate(
  date: Date | string | number,
  style: DateStyle = "medium",
  locale: string = DEFAULT_LOCALE,
): string {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(d);
}

export function formatDateTime(
  date: Date | string | number,
  options: { dateStyle?: DateStyle; timeStyle?: DateStyle; locale?: string; timeZone?: string } = {},
): string {
  const { dateStyle = "medium", timeStyle = "short", locale = DEFAULT_LOCALE, timeZone } = options;
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, { dateStyle, timeStyle, timeZone }).format(d);
}

// ── Relative time ─────────────────────────────────────────────────────

const RELATIVE_UNITS: Array<{ unit: Intl.RelativeTimeFormatUnit; seconds: number }> = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "week", seconds: 60 * 60 * 24 * 7 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

export function formatRelativeTime(
  date: Date | string | number,
  locale: string = DEFAULT_LOCALE,
  now: Date = new Date(),
): string {
  const d = date instanceof Date ? date : new Date(date);
  const diffInSeconds = Math.round((d.getTime() - now.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const { unit, seconds } of RELATIVE_UNITS) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      return rtf.format(Math.round(diffInSeconds / seconds), unit);
    }
  }
  return rtf.format(0, "second");
}

// ── Number ────────────────────────────────────────────────────────────

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions & { locale?: string } = {},
): string {
  const { locale = DEFAULT_LOCALE, ...rest } = options;
  return new Intl.NumberFormat(locale, rest).format(value);
}

export function formatPercent(
  value: number,
  options: { locale?: string; maximumFractionDigits?: number } = {},
): string {
  const { locale = DEFAULT_LOCALE, maximumFractionDigits = 1 } = options;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits,
  }).format(value);
}

// ── Bytes ─────────────────────────────────────────────────────────────

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (bytes === 0) return "0 B";
  const exponent = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), BYTE_UNITS.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(fractionDigits)} ${BYTE_UNITS[exponent]}`;
}

// ── String helpers ────────────────────────────────────────────────────

export function truncate(value: string, max: number, suffix = "…"): string {
  if (value.length <= max) return value;
  return value.slice(0, max - suffix.length) + suffix;
}

export function initials(name: string, max = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .slice(0, max)
    .join("");
}
