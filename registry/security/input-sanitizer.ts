import DOMPurify from "isomorphic-dompurify";

/**
 * HTML sanitiser for user-generated content. Wraps `isomorphic-dompurify`
 * (works on server AND client) with two opinionated profiles you'll
 * reach for again and again:
 *
 *   - `sanitizeHtml(input)`     — rich text (allows headings, lists, links, images, bold/italic)
 *   - `sanitizeHtmlStrict(input)` — strips ALL HTML, returns plain text
 *   - `sanitizeUrl(input)`      — allows http(s) + mailto only; everything else returns ""
 *
 * USE IT EVERY TIME you render `dangerouslySetInnerHTML` from a value
 * that touched a user. NEVER trust client-submitted HTML.
 *
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
 *   <a href={sanitizeUrl(comment.link)}>{comment.linkLabel}</a>
 *
 * For Markdown content, store the raw Markdown server-side and convert
 * to HTML via your renderer (rehype-sanitize already handles XSS for
 * MDX pipelines). This helper is for the case where you persist HTML.
 */

const RICH_TEXT_ALLOWED = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s", "code", "pre", "blockquote",
    "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
    "hr", "span",
  ],
  ALLOWED_ATTR: ["href", "title", "alt", "src", "target", "rel", "class"],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#)/i,
  ADD_ATTR: ["target", "rel"],
};

/** Sanitise HTML allowing common rich-text tags. Returns safe HTML. */
export function sanitizeHtml(input: string): string {
  if (!input) return "";
  // Force external links to open safely
  const html = DOMPurify.sanitize(input, RICH_TEXT_ALLOWED) as string;
  return html;
}

/** Strip all HTML — returns plain text only. */
export function sanitizeHtmlStrict(input: string): string {
  if (!input) return "";
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
}

/**
 * Sanitise a URL. Allows http, https, mailto, tel, same-origin relative
 * paths and fragments. Returns "" for anything else — including
 * `javascript:` (the classic XSS vector for unsanitised hrefs) and
 * protocol-relative `//host` (open redirect).
 */
export function sanitizeUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  // Protocol-relative URLs (`//evil.com`, and `/\evil.com` which browsers
  // normalise the same way) LOOK relative but navigate off-site — the classic
  // open-redirect bypass. A safe relative URL has exactly ONE leading slash.
  if (/^\/[/\\]/.test(trimmed)) return "";
  // Relative URLs and fragments are fine
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return trimmed;
  try {
    const url = new URL(trimmed);
    const protocol = url.protocol.toLowerCase();
    if (protocol === "http:" || protocol === "https:" || protocol === "mailto:" || protocol === "tel:") {
      return trimmed;
    }
    return "";
  } catch {
    return "";
  }
}
