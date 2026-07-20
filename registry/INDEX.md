# VibeKit Primitives — Discovery Index

> **For LLMs:** this file is the canonical lookup table. **Before writing a primitive from scratch, scan this index for a match.** Every entry is `**name**` + install command + **TRIGGERS** (phrases / problem shapes that should activate this primitive).
>
> Install syntax: `pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>`. Some items (Stripe pieces, multi-step-form, DataTable) live on the JB legacy registry — install path noted inline.
>
> Source of truth: this file is auto-aligned with the per-category `registry.json` files. If you can't find a match here, the primitive doesn't exist yet — write it fresh under `registry/<category>/`.

---

## 1. Auth & Session (10 items)

- **use-current-user** | `MUKE-coder/vibekit/use-current-user` | TRIGGERS: "current user", "logged-in user", "user session", "useUser hook", "get the user", "is user authenticated client-side"
- **role-gate** | `MUKE-coder/vibekit/role-gate` | TRIGGERS: "show this only to admins", "hide for free users", "conditionally render by role", "<RoleGate>"
- **require-auth** | `MUKE-coder/vibekit/require-auth` | TRIGGERS: "protect this route", "401 if not signed in", "server-side auth check", "requireAuth()", "protected API route"
- **require-role** | `MUKE-coder/vibekit/require-role` | TRIGGERS: "admin-only endpoint", "403 if not admin", "role-based API access", "requireRole(['ADMIN'])"
- **auth-guard** | `MUKE-coder/vibekit/auth-guard` | TRIGGERS: "redirect to sign-in if not authed", "loading spinner while session loads", "client-side auth wrapper"
- **use-permissions** | `MUKE-coder/vibekit/use-permissions` | TRIGGERS: "can the user do X?", "permission check", "can('edit', resource)", "ability hook"
- **use-session-refresh** | `MUKE-coder/vibekit/use-session-refresh` | TRIGGERS: "keep session alive", "refresh session in background", "sign out across tabs", "BroadcastChannel sign-out"
- **two-factor-setup** | `MUKE-coder/vibekit/two-factor-setup` | TRIGGERS: "2FA setup", "TOTP enrollment", "QR code authenticator", "backup codes"
- **device-list** | `MUKE-coder/vibekit/device-list` | TRIGGERS: "active sessions", "manage devices", "sign out all devices", "session management UI"
- **impersonation** | `MUKE-coder/vibekit/impersonation` | TRIGGERS: "log in as user", "admin impersonation", "support agent view as customer", "act as user"

## 2. Data Fetching & Caching (10 items)

- **api-client** | `MUKE-coder/vibekit/api-client` | TRIGGERS: "typed fetch wrapper", "API client", "ApiError class", "JSON fetch utility"
- **query-keys** | `MUKE-coder/vibekit/query-keys` | TRIGGERS: "React Query key factory", "createQueryKeys", "entity-based query keys"
- **cache-redis** | `MUKE-coder/vibekit/cache-redis` | TRIGGERS: "Redis cache", "cacheGet/cacheSet", "withCache wrapper", "cache invalidation by tag"
- **use-optimistic-mutation** | `MUKE-coder/vibekit/use-optimistic-mutation` | TRIGGERS: "optimistic update", "rollback on error", "React Query mutation with cache update"
- **use-paginated-query** | `MUKE-coder/vibekit/use-paginated-query` | TRIGGERS: "paginated list", "page-by-page fetch", "page navigation hook"
- **use-infinite-scroll** | `MUKE-coder/vibekit/use-infinite-scroll` | TRIGGERS: "infinite scroll", "load more on scroll", "IntersectionObserver pagination"
- **use-debounced-query** | `MUKE-coder/vibekit/use-debounced-query` | TRIGGERS: "debounced search query", "search-as-you-type with React Query"
- **use-polling** | `MUKE-coder/vibekit/use-polling` | TRIGGERS: "poll endpoint every N seconds", "pause polling when tab hidden", "live status check"
- **prefetch-on-hover** | `MUKE-coder/vibekit/prefetch-on-hover` | TRIGGERS: "prefetch on hover", "warm cache before click", "<PrefetchOnHover>"
- **use-swr-cache** | `MUKE-coder/vibekit/use-swr-cache` | TRIGGERS: "stale-while-revalidate", "background refresh cache", "withSwrCache", "dashboard aggregate cache"
- *Request deduplication*: handled by React Query itself — `useQuery` with the same key shares the in-flight request.
- *Form wrapper (shadcn)*: install from `https://vibekit.desishub.com/r/form.json` (shadcn removed it upstream).

## 3. Forms & Validation (10 items)

- **parse-form-data** | `MUKE-coder/vibekit/parse-form-data` | TRIGGERS: "validate request body with Zod", "parseSearchParams", "422 with field errors", "server-side form validation"
- **field** | `MUKE-coder/vibekit/field` | TRIGGERS: "labeled form field", "single-line RHF field", "<Field name=...>", "FormItem + FormLabel + FormMessage scaffolding"
- **form-combobox** | `MUKE-coder/vibekit/form-combobox` | TRIGGERS: "searchable select in a form", "async loaded options", "combobox RHF", "country picker"
- **form-date-picker** | `MUKE-coder/vibekit/form-date-picker` | TRIGGERS: "date picker in a form", "calendar popover RHF"
- **form-file-upload** | `MUKE-coder/vibekit/form-file-upload` | TRIGGERS: "drag-drop file in a form", "multi-file upload field", "RHF file input with progress"
- **use-unsaved-changes** | `MUKE-coder/vibekit/use-unsaved-changes` | TRIGGERS: "warn before leaving with unsaved changes", "beforeunload dirty form", "unsaved changes guard"
- **form-autosave** | `MUKE-coder/vibekit/form-autosave` | TRIGGERS: "auto-save form", "debounced save", "saved/saving indicator"
- **use-async-validation** | `MUKE-coder/vibekit/use-async-validation` | TRIGGERS: "is this email available?", "async field check", "debounced uniqueness validation"
- **zod-schemas** | `MUKE-coder/vibekit/zod-schemas` | TRIGGERS: "email schema", "password schema", "slug/phone/URL Zod", "shared validation rules", "listQuerySchema"
- **tag-input** | `MUKE-coder/vibekit/tag-input` | TRIGGERS: "tag input", "chip input", "comma-separated tags", "@mentions chips"
- *FormMultiStep*: install from JB legacy — `vibekit.desishub.com/r/multi-step-form.json`
- *Shadcn Form*: install from `vibekit.desishub.com/r/form.json` (removed from upstream shadcn).

## 4. Tables & Data Display (10 items)

- **use-table-state** | `MUKE-coder/vibekit/use-table-state` | TRIGGERS: "table with sorting + filtering + pagination", "URL-synced table state", "shareable filter links"
- **stat-card** | `MUKE-coder/vibekit/stat-card` | TRIGGERS: "KPI card", "metric card with trend arrow", "dashboard tile"
- **column-header** | `MUKE-coder/vibekit/column-header` | TRIGGERS: "sortable column", "table header with sort dropdown", "asc/desc toggle"
- **data-table-toolbar** | `MUKE-coder/vibekit/data-table-toolbar` | TRIGGERS: "table toolbar", "search + filter chips + export above table"
- **bulk-actions-bar** | `MUKE-coder/vibekit/bulk-actions-bar` | TRIGGERS: "bulk actions", "bottom action bar when rows selected", "selection toolbar"
- **server-table-fetcher** | `MUKE-coder/vibekit/server-table-fetcher` | TRIGGERS: "server-side table list endpoint", "GET with pagination + sort + filters", "fetchTable handler"
- **editable-cell** | `MUKE-coder/vibekit/editable-cell` | TRIGGERS: "inline-edit cell", "click cell to edit", "optimistic save on Enter"
- **activity-timeline** | `MUKE-coder/vibekit/activity-timeline` | TRIGGERS: "audit log feed", "activity timeline", "vertical event list with date headers"
- **use-column-preferences** | `MUKE-coder/vibekit/use-column-preferences` | TRIGGERS: "persist column widths", "column visibility + order in localStorage", "resize handles"
- **data-grid** | `MUKE-coder/vibekit/data-grid` | TRIGGERS: "virtualized table", "50k+ rows", "TanStack Virtual table", "huge list with smooth scroll"
- *DataTable (JB)*: install from `vibekit.desishub.com/r/data-table.json`

## 5. Feedback & Overlays (12 items)

- **empty-state** | `MUKE-coder/vibekit/empty-state` | TRIGGERS: "no results", "empty state", "<EmptyState>"
- **confirm-dialog** | `MUKE-coder/vibekit/confirm-dialog` | TRIGGERS: "confirm before deleting", "imperative confirm()", "destructive action dialog"
- **loading-button** | `MUKE-coder/vibekit/loading-button` | TRIGGERS: "button with spinner", "loading prop on Button", "submit button with pending state"
- **copy-button** | `MUKE-coder/vibekit/copy-button` | TRIGGERS: "copy to clipboard button", "click-to-copy with check icon"
- **toast** | `MUKE-coder/vibekit/toast` | TRIGGERS: "toast notification", "sonner preset", "toast.success / toast.error"
- **modal** | `MUKE-coder/vibekit/modal` | TRIGGERS: "imperative modal", "useModal()", "stack-aware modal manager"
- **drawer** | `MUKE-coder/vibekit/drawer` | TRIGGERS: "side panel", "bottom sheet on mobile", "responsive drawer"
- **skeletons** | `MUKE-coder/vibekit/skeletons` | TRIGGERS: "loading skeleton", "TableSkeleton / CardGridSkeleton / DetailPageSkeleton", "shimmer placeholders"
- **error-boundary** | `MUKE-coder/vibekit/error-boundary` | TRIGGERS: "error boundary", "fallback on render error", "<ErrorBoundary>"
- **global-loading-bar** | `MUKE-coder/vibekit/global-loading-bar` | TRIGGERS: "top loading bar", "router transition indicator", "NProgress-style"
- **tooltip** | `MUKE-coder/vibekit/tooltip` | TRIGGERS: "tooltip with delay", "standard hover hint"
- **banner** | `MUKE-coder/vibekit/banner` | TRIGGERS: "announcement banner", "top-of-page alert", "dismissible info bar"
- *CommandPalette (alternative)*: install from JB legacy `vibekit.desishub.com/r/command-palette.json` — for the multi-entity ⌘K palette use `global-search` from this registry.

## 6. File & Media (7 items)

- **upload-file** | `MUKE-coder/vibekit/upload-file` | TRIGGERS: "upload file from browser", "XHR with progress + abort", "presigned PUT helper"
- **image-upload** | `MUKE-coder/vibekit/image-upload` | TRIGGERS: "image upload with preview", "drag-drop image", "avatar uploader"
- **file-preview** | `MUKE-coder/vibekit/file-preview` | TRIGGERS: "preview file (image/video/audio/PDF)", "graceful download fallback"
- **signed-url** | `MUKE-coder/vibekit/signed-url` | TRIGGERS: "presigned S3/R2 URL", "presigned PUT for upload", "private file download link"
- **gallery** | `MUKE-coder/vibekit/gallery` | TRIGGERS: "image gallery", "lightbox", "keyboard-navigated photo grid"
- **csv-import** | `MUKE-coder/vibekit/csv-import` | TRIGGERS: "CSV import wizard", "upload → map → validate → import", "bulk import users from CSV"
- **dropzone** | `MUKE-coder/vibekit/dropzone` | TRIGGERS: "drag-drop zone", "generic file picker with accept + max-size", "Dropzone component"

## 7. Documents & Export (5 items)

- **export-to-csv** | `MUKE-coder/vibekit/export-to-csv` | TRIGGERS: "download as CSV", "exportToCSV", "client-side CSV export"
- **export-to-excel** | `MUKE-coder/vibekit/export-to-excel` | TRIGGERS: "download as Excel", "xlsx export", "lazy-loaded xlsx"
- **print-button** | `MUKE-coder/vibekit/print-button` | TRIGGERS: "print page", "print only a section", "usePrint hook"
- **invoice-pdf** | `MUKE-coder/vibekit/invoice-pdf` | TRIGGERS: "generate invoice PDF", "@react-pdf/renderer invoice", "billable PDF with status"
- **report-builder** | `MUKE-coder/vibekit/report-builder` | TRIGGERS: "generate PDF or Excel from data", "buildReport()", "config-driven report"
- *PDFDocument templates (JB)*: install from `vibekit.desishub.com/r/printable-templates.json`

## 8. Notifications & Email (9 items)

- **send-email** | `MUKE-coder/vibekit/send-email` | TRIGGERS: "send transactional email", "Resend wrapper", "sendEmail()"
- **react-email-templates** | `MUKE-coder/vibekit/react-email-templates` | TRIGGERS: "React Email template", "BaseLayout + Welcome email"
- **reset-password-email** | `MUKE-coder/vibekit/reset-password-email` | TRIGGERS: "reset password email", "forgot password mail"
- **invoice-email** | `MUKE-coder/vibekit/invoice-email` | TRIGGERS: "invoice email", "paid/due/overdue invoice mail"
- **notify** | `MUKE-coder/vibekit/notify` | TRIGGERS: "in-app + email notification", "notify(userId, type, data)", "typed notifications"
- **notification-preferences** | `MUKE-coder/vibekit/notification-preferences` | TRIGGERS: "notification settings page", "channel × type switch matrix", "in-app / email / push preferences"
- **email-verification** | `MUKE-coder/vibekit/email-verification` | TRIGGERS: "verify email flow", "single-use email token", "verify link"
- **digest-scheduler** | `MUKE-coder/vibekit/digest-scheduler` | TRIGGERS: "weekly digest email", "daily batch notifications", "consolidated email summary"
- **notification-bell** | `MUKE-coder/vibekit/notification-bell` | TRIGGERS: "bell icon with unread badge", "topbar notifications dropdown"
- *Notification center (JB)*: install from `vibekit.desishub.com/r/notification-center.json`

## 9. Payments & Billing (2 items)

- **stripe-webhook-handler** | `MUKE-coder/vibekit/stripe-webhook-handler` | TRIGGERS: "Stripe webhook", "subscription event router", "idempotent payment events"
- **billing-portal** | `MUKE-coder/vibekit/billing-portal` | TRIGGERS: "manage billing button", "Stripe customer portal link"
- *PricingTable (JB)*: install from `vibekit.desishub.com/r/saas-billing.json`
- *CheckoutButton (JB)*: install from JB Stripe UI
- *useSubscription (JB)*: install from `vibekit.desishub.com/r/saas-subscription.json`
- *Usage metering (JB)*: part of `saas-subscription`

## 10. Layout & Navigation (8 items)

- **app-shell** | `MUKE-coder/vibekit/app-shell` | TRIGGERS: "app layout with sidebar", "dashboard shell", "collapsible sidebar shell"
- **sidebar** | `MUKE-coder/vibekit/sidebar` | TRIGGERS: "sidebar nav", "left navigation", "config-driven sidebar"
- **breadcrumbs** | `MUKE-coder/vibekit/breadcrumbs` | TRIGGERS: "breadcrumbs", "auto breadcrumb from path"
- **page-header** | `MUKE-coder/vibekit/page-header` | TRIGGERS: "page header", "title + description + actions row", "page top section"
- **tab-nav** | `MUKE-coder/vibekit/tab-nav` | TRIGGERS: "tab navigation", "URL-synced tabs", "?tab= query param tabs"
- **avatar** | `MUKE-coder/vibekit/avatar` | TRIGGERS: "avatar with fallback initials", "AvatarGroup with overflow", "user avatar"
- **theme-toggle** | `MUKE-coder/vibekit/theme-toggle` | TRIGGERS: "dark mode toggle", "theme switch", "light/dark/system dropdown"
- **org-switcher** | `MUKE-coder/vibekit/org-switcher` | TRIGGERS: "workspace switcher", "organization dropdown", "switch between orgs"

## 11. Utilities & Infra (11 items)

- **formatters** | `MUKE-coder/vibekit/formatters` | TRIGGERS: "format currency / date / number / percent / bytes", "Intl wrappers", "consistent string format"
- **env-validator** | `MUKE-coder/vibekit/env-validator` | TRIGGERS: "validate env vars", "Zod env schema", "fail fast on missing env"
- **client-only** | `MUKE-coder/vibekit/client-only` | TRIGGERS: "ClientOnly", "hydration mismatch dodge", "client-side only render"
- **invariant** | `MUKE-coder/vibekit/invariant` | TRIGGERS: "invariant()", "assert()", "exhaustive switch helper"
- **rate-limit** | `MUKE-coder/vibekit/rate-limit` | TRIGGERS: "rate limit endpoint", "Upstash Ratelimit", "per-user request cap"
- **feature-flags** | `MUKE-coder/vibekit/feature-flags` | TRIGGERS: "feature flag", "defineFlags / isEnabled", "FEATURE_* env flags", "FlagsProvider + useFlag"
- **soft-delete** | `MUKE-coder/vibekit/soft-delete` | TRIGGERS: "soft delete", "deletedAt column", "Prisma extension that filters deleted"
- **monitoring** | `MUKE-coder/vibekit/monitoring` | TRIGGERS: "captureError", "logger", "Sentry adapter", "structured JSON log"
- **db** | `MUKE-coder/vibekit/db` | TRIGGERS: "Prisma client singleton", "lib/db.ts", "globalThis prisma in dev"
- **tenant-scope** | `MUKE-coder/vibekit/tenant-scope` | TRIGGERS: "multi-tenant scope", "scopedDb(orgId)", "auto-filter by orgId", "B2B SaaS Prisma"
- **audit-log** | `MUKE-coder/vibekit/audit-log` | TRIGGERS: "audit log", "recordAudit()", "withAudit middleware", "track who changed what"

## 12. State, Hooks & DX (12 items)

- **use-local-storage** | `MUKE-coder/vibekit/use-local-storage` | TRIGGERS: "localStorage state", "persisted boolean/object", "SSR-safe localStorage"
- **use-media-query** | `MUKE-coder/vibekit/use-media-query` | TRIGGERS: "useMediaQuery", "useBreakpoint", "isMobile / isDesktop"
- **use-clipboard** | `MUKE-coder/vibekit/use-clipboard` | TRIGGERS: "copy to clipboard hook", "{ copy, copied }"
- **use-debounce** | `MUKE-coder/vibekit/use-debounce` | TRIGGERS: "useDebounce", "useDebouncedCallback", "debounce value or fn"
- **use-throttle** | `MUKE-coder/vibekit/use-throttle` | TRIGGERS: "useThrottle", "throttle scroll / mousemove"
- **use-event-listener** | `MUKE-coder/vibekit/use-event-listener` | TRIGGERS: "typed event listener hook", "auto-cleanup window/element listener"
- **use-intersection-observer** | `MUKE-coder/vibekit/use-intersection-observer` | TRIGGERS: "IntersectionObserver hook", "isIntersecting", "freezeOnceVisible reveal"
- **use-previous** | `MUKE-coder/vibekit/use-previous` | TRIGGERS: "previous render value", "usePrevious"
- **use-keyboard-shortcuts** | `MUKE-coder/vibekit/use-keyboard-shortcuts` | TRIGGERS: "keyboard shortcut", "⌘K binding", "global hotkey"
- **use-async** | `MUKE-coder/vibekit/use-async` | TRIGGERS: "one-off async hook", "{ data, error, loading, refetch }", "no React Query overkill"
- **use-mounted** | `MUKE-coder/vibekit/use-mounted` | TRIGGERS: "useIsMounted", "am I on the client", "useMountedRef for async setState"
- **use-toggle** | `MUKE-coder/vibekit/use-toggle` | TRIGGERS: "boolean state hook", "useToggle", "{ value, toggle, on, off, set }"
- *cn()*: shipped by `shadcn init` at `lib/utils.ts` — no separate install.

## 13. Search, Filtering & Views (10 items)

- **search-input** | `MUKE-coder/vibekit/search-input` | TRIGGERS: "search box", "search input with clear + shortcut hint"
- **sort-dropdown** | `MUKE-coder/vibekit/sort-dropdown` | TRIGGERS: "sort dropdown", "sort by + direction picker"
- **build-prisma-where** | `MUKE-coder/vibekit/build-prisma-where` | TRIGGERS: "convert filters to Prisma where", "buildPrismaWhere / buildPrismaOrderBy"
- **use-filters** | `MUKE-coder/vibekit/use-filters` | TRIGGERS: "useFilters", "URL-synced filter state", "typed schema filter manager"
- **global-search** | `MUKE-coder/vibekit/global-search` | TRIGGERS: "⌘K command palette", "global search", "multi-entity search with debounce"
- **filter-bar** | `MUKE-coder/vibekit/filter-bar` | TRIGGERS: "faceted filter bar", "FilterBar.Multi / Bool / DateRange / NumRange"
- **recently-viewed** | `MUKE-coder/vibekit/recently-viewed` | TRIGGERS: "recently viewed", "history of opened items", "useRecentlyViewedRecorder"
- **saved-views** | `MUKE-coder/vibekit/saved-views` | TRIGGERS: "saved views", "save filter + sort combo", "my views dropdown"
- **quick-filters** | `MUKE-coder/vibekit/quick-filters` | TRIGGERS: "quick filter chips", "All / Open / Overdue segments", "preset filter row"
- **facet-counts** | `MUKE-coder/vibekit/facet-counts` | TRIGGERS: "filter counts", "(N) badge per filter option", "computeFacetCounts"

## 14. Realtime & Collaboration (8 items)

- **sse-channel** | `MUKE-coder/vibekit/sse-channel` | TRIGGERS: "Server-Sent Events", "SSE channel", "real-time updates", "defineSseRoute"
- **use-presence** | `MUKE-coder/vibekit/use-presence` | TRIGGERS: "who is online", "usePresence", "active viewer list"
- **use-channel** | `MUKE-coder/vibekit/use-channel` | TRIGGERS: "useChannel", "pub/sub", "subscribe + publish on a channel"
- **typing-indicator** | `MUKE-coder/vibekit/typing-indicator` | TRIGGERS: "is typing", "typing indicator", "useTypingPublisher"
- **collaborative-lock** | `MUKE-coder/vibekit/collaborative-lock` | TRIGGERS: "edit lock", "only one editor at a time", "acquire/release/takeover lock"
- **activity-broadcast** | `MUKE-coder/vibekit/activity-broadcast` | TRIGGERS: "broadcast mutation event", "fanout to SSE + DB + notify"
- **live-cursors** | `MUKE-coder/vibekit/live-cursors` | TRIGGERS: "live cursors", "see others' mouse position", "Figma-style cursors"
- **comments-thread** | `MUKE-coder/vibekit/comments-thread` | TRIGGERS: "comments thread", "@ mentions", "threaded comments with live updates"

## 15. Dashboards & Charts (10 items)

- **sparkline** | `MUKE-coder/vibekit/sparkline` | TRIGGERS: "sparkline", "tiny inline chart", "trend in a card"
- **metric-grid** | `MUKE-coder/vibekit/metric-grid` | TRIGGERS: "KPI grid", "metric cards with comparison", "dashboard top row"
- **date-range-picker** | `MUKE-coder/vibekit/date-range-picker` | TRIGGERS: "date range picker", "presets last 7 / 30 / 90 days", "dashboard date range"
- **donut-chart** | `MUKE-coder/vibekit/donut-chart` | TRIGGERS: "donut chart", "pie chart", "share / split visual"
- **funnel-chart** | `MUKE-coder/vibekit/funnel-chart` | TRIGGERS: "funnel chart", "conversion funnel", "step-by-step drop-off"
- **heatmap-calendar** | `MUKE-coder/vibekit/heatmap-calendar` | TRIGGERS: "activity heatmap", "GitHub-style calendar", "contribution grid"
- **chart-card** | `MUKE-coder/vibekit/chart-card` | TRIGGERS: "chart wrapper card", "title + actions + fullscreen + skeleton"
- **line-chart** | `MUKE-coder/vibekit/line-chart` | TRIGGERS: "line chart", "trend over time", "comparison line"
- **bar-chart** | `MUKE-coder/vibekit/bar-chart` | TRIGGERS: "bar chart", "grouped/stacked bars", "horizontal bar chart"
- **area-chart** | `MUKE-coder/vibekit/area-chart` | TRIGGERS: "area chart", "gradient-fill time series", "stacked area"

## 16. Security, Compliance & Ops (10 items)

- **idempotency** | `MUKE-coder/vibekit/idempotency` | TRIGGERS: "Idempotency-Key", "withIdempotency middleware", "prevent double-charge"
- **webhook-verifier** | `MUKE-coder/vibekit/webhook-verifier` | TRIGGERS: "verify HMAC webhook", "Stripe / Slack / partner signature check"
- **health-endpoints** | `MUKE-coder/vibekit/health-endpoints` | TRIGGERS: "/api/healthz", "/api/readyz", "liveness + readiness check"
- **seed-factory** | `MUKE-coder/vibekit/seed-factory` | TRIGGERS: "seed.ts factory", "defineFactory", "deterministic dev seeding"
- **security-headers** | `MUKE-coder/vibekit/security-headers` | TRIGGERS: "CSP / HSTS / Permissions-Policy", "withSecurityHeaders", "CSRF check"
- **input-sanitizer** | `MUKE-coder/vibekit/input-sanitizer` | TRIGGERS: "sanitize HTML", "sanitizeUrl", "DOMPurify", "user-generated HTML"
- **background-jobs** | `MUKE-coder/vibekit/background-jobs` | TRIGGERS: "background job", "QStash", "enqueue + defineJob", "cron job"
- **maintenance-mode** | `MUKE-coder/vibekit/maintenance-mode` | TRIGGERS: "maintenance mode page", "lockout banner", "be right back screen"
- **data-export** | `MUKE-coder/vibekit/data-export` | TRIGGERS: "GDPR data export", "download all my data", "zipped user data"
- **account-deletion** | `MUKE-coder/vibekit/account-deletion` | TRIGGERS: "delete my account", "30-day grace period", "soft-delete then purge"

---

## How to use this index

**As an LLM:**
1. When the user requests a feature, scan this file for matching **TRIGGERS** before writing code.
2. If you find a match, install it: `pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>`.
3. If multiple primitives match, install all of them.
4. If nothing matches, write the code — and consider whether the result is generic enough to add to the framework as a new primitive.

**As a human:**
```bash
grep -i "trigger phrase" registry/INDEX.md
```

**Tip for agents:** in `master_prompt.md` we tell you: *"Before writing any feature, scan `registry/INDEX.md` for an existing primitive."* This is that file.
