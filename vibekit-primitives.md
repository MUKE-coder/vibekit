# VibeKit Primitives — The 150 Reusable Library

> A GitHub-registry-hosted library of hooks, helpers, and small components every CRM/ERP/SaaS rebuilds. Install any item with `pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>`.
>
> **Different from the JB Component Registry:** JB ships big feature units (auth, kanban, charts, billing). VibeKit Primitives ships the small reusable building blocks that compound across every project.
>
> **How the registry works:** [Shadcn GitHub registries](https://ui.shadcn.com/docs/registry/github). The repo's `registry.json` is the index. Each item references real `.tsx` / `.ts` files under `registry/<category>/` — no JSON-endpoint round-trip, no embedded source strings, free version pinning via git tags.
>
> **Status flags:** ✅ shipped · 🟡 in progress · ⏳ pending

---

## How to install

```bash
# Latest from main
pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>

# Pin to a tag or commit (production-safe)
pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>#v1.0.0
pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>#c0ffee2...
```

Browse + search from the CLI:

```bash
pnpm dlx shadcn@latest list MUKE-coder/vibekit
pnpm dlx shadcn@latest search MUKE-coder/vibekit --query timeline
pnpm dlx shadcn@latest view MUKE-coder/vibekit/use-current-user
```

---

## Shipped — 141 items 🎉

### Auth & Session

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-current-user** | `MUKE-coder/vibekit/use-current-user` | Typed React Query hook for the current session user. Drop-in for Better Auth |
| ✅ | **role-gate** | `MUKE-coder/vibekit/role-gate` | `<RoleGate roles={['admin']}>...</RoleGate>` — client gate using `useCurrentUser` |
| ✅ | **require-auth** | `MUKE-coder/vibekit/require-auth` | Server-side `requireAuth()` / `getOptionalUser()` for route handlers & server components |
| ✅ | **require-role** | `MUKE-coder/vibekit/require-role` | Composes with require-auth — throws 403 on role mismatch |

### Forms

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **parse-form-data** | `MUKE-coder/vibekit/parse-form-data` | Server Zod validators (`parseRequestBody`, `safeParseRequestBody`, `parseSearchParams`) returning 422 with RHF-shaped errors |

### Tables & Data Display

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-table-state** | `MUKE-coder/vibekit/use-table-state` | URL-synced page/pageSize/sort/dir/q/filters. Makes every table shareable + bookmarkable |
| ✅ | **stat-card** | `MUKE-coder/vibekit/stat-card` | KPI card with value, label, trend arrow, icon, sparkline slot, loading skeleton |

### Feedback & Overlays

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **empty-state** | `MUKE-coder/vibekit/empty-state` | `<EmptyState>` for "no data" and "no results" — default + inline variants |
| ✅ | **confirm-dialog** | `MUKE-coder/vibekit/confirm-dialog` | Imperative `await confirm({...})` API. No JSX boilerplate at call sites |
| ✅ | **loading-button** | `MUKE-coder/vibekit/loading-button` | shadcn Button with built-in spinner + disabled on `loading` |
| ✅ | **copy-button** | `MUKE-coder/vibekit/copy-button` | Click-to-copy with success state + clipboard fallback |

### Hooks & DX

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-local-storage** | `MUKE-coder/vibekit/use-local-storage` | SSR-safe, typed, cross-tab sync via storage event |
| ✅ | **use-media-query** | `MUKE-coder/vibekit/use-media-query` | + `useBreakpoint()` for isMobile/isTablet/isDesktop |
| ✅ | **use-clipboard** | `MUKE-coder/vibekit/use-clipboard` | `{ copy, copied }` hook with timeout + fallback |
| ✅ | **use-debounce** | `MUKE-coder/vibekit/use-debounce` | Value + callback debounce with `cancel()`. Universal for search/autosave |
| ✅ | **use-throttle** | `MUKE-coder/vibekit/use-throttle` | Value + callback throttle for scroll/mouse-rate signals |
| ✅ | **use-event-listener** | `MUKE-coder/vibekit/use-event-listener` | Typed window/document/element listener with auto-cleanup |
| ✅ | **use-intersection-observer** | `MUKE-coder/vibekit/use-intersection-observer` | Visibility hook with `freezeOnceVisible` for one-shot reveals |
| ✅ | **use-previous** | `MUKE-coder/vibekit/use-previous` | Returns the previous render's value. Tiny but constantly needed |

### Layout

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **avatar** | `MUKE-coder/vibekit/avatar` | Avatar with auto-initials fallback, status dot, sizes, + AvatarGroup for stacked overlap |
| ✅ | **page-header** | `MUKE-coder/vibekit/page-header` | Title + description + eyebrow + breadcrumbs slot + right-aligned actions, responsive |
| ✅ | **breadcrumbs** | `MUKE-coder/vibekit/breadcrumbs` | Auto-generated from pathname (or pass `items`). Supports label overrides for dynamic segments |

### Utilities & Infra

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **formatters** | `MUKE-coder/vibekit/formatters` | `formatCurrency`, `formatDate`, `formatRelativeTime`, `formatNumber`, `formatBytes`, `truncate`, `initials` |
| ✅ | **env-validator** | `MUKE-coder/vibekit/env-validator` | Zod-validated env loader. Fails fast at boot if vars are missing/malformed |
| ✅ | **client-only** | `MUKE-coder/vibekit/client-only` | `<ClientOnly>` defers rendering until mount — dodges hydration mismatches |
| ✅ | **invariant** | `MUKE-coder/vibekit/invariant` | `invariant`, `assert`, `exhaustive` — dev-time assertions with TS narrowing |
| ✅ | **rate-limit** | `MUKE-coder/vibekit/rate-limit` | Upstash Ratelimit wrapper with cached limiters per (tokens, window) |

### Forms (Phase 3 — wrappers on top of the Form fallback)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **field** | `MUKE-coder/vibekit/field` | One-row labeled field. Handles FormField/FormItem/FormLabel/FormControl/FormDescription/FormMessage scaffolding for any text/email/number input or textarea |
| ✅ | **form-combobox** | `MUKE-coder/vibekit/form-combobox` | Searchable combobox with static OR async options — bound to RHF |
| ✅ | **form-date-picker** | `MUKE-coder/vibekit/form-date-picker` | Calendar-in-popover, RHF-bound, configurable format + bounds |
| ✅ | **use-unsaved-changes** | `MUKE-coder/vibekit/use-unsaved-changes` | Warns before navigation when a form is dirty (beforeunload + anchor click capture) |

### Data Fetching (Phase 3)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **api-client** | `MUKE-coder/vibekit/api-client` | Typed fetch wrapper + ApiError class, default headers, query-param injection |
| ✅ | **query-keys** | `MUKE-coder/vibekit/query-keys` | `entityKeys` / `createQueryKeys` factory for consistent invalidation-friendly React Query keys |
| ✅ | **use-optimistic-mutation** | `MUKE-coder/vibekit/use-optimistic-mutation` | useMutation wrapper with optimistic update, rollback on error, toast hooks |
| ✅ | **use-paginated-query** | `MUKE-coder/vibekit/use-paginated-query` | Server-side pagination over the framework's `{ data, total, page, pageSize, totalPages }` shape |
| ✅ | **use-debounced-query** | `MUKE-coder/vibekit/use-debounced-query` | Search-style query with built-in input debounce + keepPreviousData |

### Email (Phase 3)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **send-email** | `MUKE-coder/vibekit/send-email` | Typed Resend wrapper supporting React Email / HTML / plain-text, dev-preview mode |

### Tables — chrome (Phase 3)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **column-header** | `MUKE-coder/vibekit/column-header` | Sortable header with direction indicator + dropdown (Ascending / Descending / Hide) |
| ✅ | **data-table-toolbar** | `MUKE-coder/vibekit/data-table-toolbar` | Search + faceted filters + column-visibility + export + reset + actions slot |
| ✅ | **bulk-actions-bar** | `MUKE-coder/vibekit/bulk-actions-bar` | Floating action bar on row selection. Auto-hides at zero, Escape clears |

### Feedback (Phase 3)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **error-boundary** | `MUKE-coder/vibekit/error-boundary` | React error boundary with styled default fallback, retry, resetKey, onError hook |
| ✅ | **skeletons** | `MUKE-coder/vibekit/skeletons` | Layout-matched skeleton bundle (TableSkeleton, CardGridSkeleton, DetailPageSkeleton, FormSkeleton, StatRowSkeleton) |

### Layout (Phase 4 — shell + sidebar + tabs)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **app-shell** | `MUKE-coder/vibekit/app-shell` | Sidebar + topbar + content shell; collapse persisted; mobile drawer; useAppShell hook |
| ✅ | **sidebar** | `MUKE-coder/vibekit/sidebar` | Config-driven sidebar — links + nested groups, role filter, badges, active state, collapse |
| ✅ | **tab-nav** | `MUKE-coder/vibekit/tab-nav` | URL-synced tabs (`path` or `?tab=` query mode), badges, hidden/disabled |

### Search & Filtering (Phase 4 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **search-input** | `MUKE-coder/vibekit/search-input` | Standardised search box — icon + spinner + clear + keyboard shortcut hint |
| ✅ | **sort-dropdown** | `MUKE-coder/vibekit/sort-dropdown` | Field + direction selector pairing with useTableState |
| ✅ | **build-prisma-where** | `MUKE-coder/vibekit/build-prisma-where` | Convert useTableState query into a typed Prisma where + orderBy |

### Documents & Export (Phase 4 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **export-to-csv** | `MUKE-coder/vibekit/export-to-csv` | RFC-4180 client-side CSV export with UTF-8 BOM (Excel detection) |
| ✅ | **export-to-excel** | `MUKE-coder/vibekit/export-to-excel` | Lazy-loaded xlsx export — kept out of initial bundle, type-hinted columns |

### File & Media (Phase 4 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **file-preview** | `MUKE-coder/vibekit/file-preview` | Inline preview for image/video/audio/PDF with icon + download fallback for everything else |

### Security & Ops (Phase 4 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **idempotency** | `MUKE-coder/vibekit/idempotency` | Idempotency-Key middleware caching responses in Upstash for 24h — retries return the original result |
| ✅ | **webhook-verifier** | `MUKE-coder/vibekit/webhook-verifier` | Generic HMAC verifier with timing-safe equality, configurable algorithm + encoding |
| ✅ | **health-endpoints** | `MUKE-coder/vibekit/health-endpoints` | /api/healthz (liveness) + /api/readyz (DB + Redis reachability check) handlers |

### Data Fetching (Phase 4)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-infinite-scroll** | `MUKE-coder/vibekit/use-infinite-scroll` | Wires a React Query infinite query to an IntersectionObserver sentinel |

### Feedback (Phase 4)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **toast** | `MUKE-coder/vibekit/toast` | Pre-configured Sonner Toaster + `toast` helper with a `toast.confirm()` extension |

### Auth (Phase 5 — chrome completes)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **auth-guard** | `MUKE-coder/vibekit/auth-guard` | Client-side gate — spinner while loading, redirect to sign-in with callbackUrl when no session |
| ✅ | **use-permissions** | `MUKE-coder/vibekit/use-permissions` | Typed `can(action, resource)` + `hasRole(...)` backed by a permission matrix you customise |
| ✅ | **use-session-refresh** | `MUKE-coder/vibekit/use-session-refresh` | Silent periodic session refresh + BroadcastChannel cross-tab sync |

### Hooks (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-keyboard-shortcuts** | `MUKE-coder/vibekit/use-keyboard-shortcuts` | Typed shortcut registry with `mod` alias (Cmd/Ctrl), input-aware default, formatShortcut for help dialogs |

### Forms (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **form-autosave** | `MUKE-coder/vibekit/form-autosave` | Debounced RHF autosave + 3-state indicator (idle / saving / saved with checkmark / error) |

### Tables (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **server-table-fetcher** | `MUKE-coder/vibekit/server-table-fetcher` | `fetchTable(req, opts)` — parses query, builds Prisma where + orderBy, runs findMany + count, returns the usePaginatedQuery shape |

### Search (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-filters** | `MUKE-coder/vibekit/use-filters` | Typed URL-synced filter state — multi-select, bool, single-select, date range, number range; set / toggle / clear / reset / isActive / activeCount |

### Charts (Phase 5 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **sparkline** | `MUKE-coder/vibekit/sparkline` | Tiny inline trend chart (Recharts) — line or area, optional tooltip, responsive |
| ✅ | **metric-grid** | `MUKE-coder/vibekit/metric-grid` | KPI row with trend arrow + comparison-vs-previous, optional sparkline slot, loading skeleton |

### Feedback (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **drawer** | `MUKE-coder/vibekit/drawer` | Responsive side panel (right on desktop, bottom sheet on mobile) with header/footer slots |
| ✅ | **tooltip** | `MUKE-coder/vibekit/tooltip` | Standardised Tooltip wrapper — consistent delay/sizing/alignment, no four-component boilerplate |

### Utilities (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **feature-flags** | `MUKE-coder/vibekit/feature-flags` | Static env-flag + optional runtime evaluator; client snapshot via FlagsProvider + useFlag() |
| ✅ | **soft-delete** | `MUKE-coder/vibekit/soft-delete` | Prisma client extension that auto-filters out rows with deletedAt set + softDelete/restore helpers |

### Security (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **seed-factory** | `MUKE-coder/vibekit/seed-factory` | defineFactory + oneOf/pickN/chance/range/aroundDate helpers; flushFactories for idempotent dev seeding |

### Email (Phase 5)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **react-email-templates** | `MUKE-coder/vibekit/react-email-templates` | BaseLayout (logo, footer, Tailwind container) + WelcomeEmail using it. Drop-in transactional email starter |

### File & Media (Phase 6 — uploads vertical complete)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **signed-url** | `MUKE-coder/vibekit/signed-url` | Server: presigned R2/S3 download + upload URLs (supports R2 endpoint + path-style addressing) |
| ✅ | **upload-file** | `MUKE-coder/vibekit/upload-file` | Client: sign → PUT direct to R2/S3 via XHR with progress events + abort |
| ✅ | **image-upload** | `MUKE-coder/vibekit/image-upload` | Drag-drop ImageUpload with type+size validation, progress bar, preview, replace/remove |

### Feedback (Phase 6 — close out the surface)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **modal** | `MUKE-coder/vibekit/modal` | Stack-aware imperative ModalProvider + useModal + Modal slot helpers |
| ✅ | **banner** | `MUKE-coder/vibekit/banner` | Dismissible site-wide banner with localStorage-persisted dismissal keyed by `id` |
| ✅ | **global-loading-bar** | `MUKE-coder/vibekit/global-loading-bar` | Top progress bar on App Router transitions — no nprogress dependency |

### Tables (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **editable-cell** | `MUKE-coder/vibekit/editable-cell` | Inline-edit cell with optimistic save + rollback, Esc/Enter handling, validation |

### Charts (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **date-range-picker** | `MUKE-coder/vibekit/date-range-picker` | Calendar-in-popover with dashboard presets (Today / 7d / 30d / This month / QTD / YTD) |

### Email (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **reset-password-email** | `MUKE-coder/vibekit/reset-password-email` | Password-reset template using BaseLayout; single-use URL + expiry copy |

### Notifications (Phase 6 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **notify** | `MUKE-coder/vibekit/notify` | Typed `defineNotify({ types, sendEmail, persistInApp, loadUser })` — one call writes in-app row + sends email, respecting prefs |

### Security & Ops (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **security-headers** | `MUKE-coder/vibekit/security-headers` | `withSecurityHeaders` middleware — CSP, HSTS, X-Frame, X-CTO, Referrer-Policy, Permissions-Policy + same-origin CSRF Origin check |
| ✅ | **input-sanitizer** | `MUKE-coder/vibekit/input-sanitizer` | sanitizeHtml (rich text) + sanitizeHtmlStrict (plain text) + sanitizeUrl. Isomorphic (server + client) |
| ✅ | **background-jobs** | `MUKE-coder/vibekit/background-jobs` | jobs.enqueue() + defineJob() — typed QStash wrapper with delay/cron, signature verification, Zod payload validation |

### Search (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **global-search** | `MUKE-coder/vibekit/global-search` | ⌘K palette — debounced multi-entity fetch, grouped results, recent items, global keyboard shortcut |

### Layout (Phase 6)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **theme-toggle** | `MUKE-coder/vibekit/theme-toggle` | next-themes-backed toggle — dropdown (Light/Dark/System) or cycle variant, mount-gated to dodge SSR mismatch |

### Data Fetching (Phase 7 — caching layer complete)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **cache-redis** | `MUKE-coder/vibekit/cache-redis` | cacheGet / cacheSet / `withCache(key, ttl, fn)` / `invalidateCache(...patterns)` + tag helpers |
| ✅ | **use-polling** | `MUKE-coder/vibekit/use-polling` | Polling manager that pauses on hidden tabs; usePolling (query key) + usePollingFn (callback) |
| ✅ | **prefetch-on-hover** | `MUKE-coder/vibekit/prefetch-on-hover` | RQ prefetch on hover/focus with cooldown throttle; wrapper + hook variants |

### Forms (Phase 7)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **use-async-validation** | `MUKE-coder/vibekit/use-async-validation` | Debounced async field validation with AbortController cancellation; pair with RHF setError |

### Payments (Phase 7 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **stripe-webhook-handler** | `MUKE-coder/vibekit/stripe-webhook-handler` | Typed Stripe webhook router — signature verification, dispatch by type, idempotency via your stripeEvent table |
| ✅ | **billing-portal** | `MUKE-coder/vibekit/billing-portal` | createBillingPortalSession + route-handler factory — one-line bounce to Stripe's hosted customer portal |

### Documents (Phase 7)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **print-button** | `MUKE-coder/vibekit/print-button` | PrintButton + usePrint; targetId option prints just one element via scoped @media print rule |

### Realtime (Phase 7 — new category)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **sse-channel** | `MUKE-coder/vibekit/sse-channel` | defineSseRoute server helper (heartbeat + cleanup on abort) + useSseChannel client subscriber with auto-reconnect |
| ✅ | **use-presence** | `MUKE-coder/vibekit/use-presence` | Active-viewer presence — heartbeat + polled member list, returns { users, others, isLoading } |

### Charts (Phase 7)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **donut-chart** | `MUKE-coder/vibekit/donut-chart` | Donut/pie chart with centre-label slot, legend, theme-token palette |
| ✅ | **funnel-chart** | `MUKE-coder/vibekit/funnel-chart` | Conversion funnel with auto per-stage % conversion labels |
| ✅ | **heatmap-calendar** | `MUKE-coder/vibekit/heatmap-calendar` | GitHub-style contribution grid with configurable thresholds + per-cell tooltip + click handler |

### Tables (Phase 7)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **activity-timeline** | `MUKE-coder/vibekit/activity-timeline` | Vertical audit/activity feed with sticky date-group headers, actor avatars, custom icon + detail slot per entry |

### Security & Ops (Phase 7)

| Status | Item | Install | What it does |
|---|---|---|---|
| ✅ | **maintenance-mode** | `MUKE-coder/vibekit/maintenance-mode` | Full-page lockout + admin banner + server-safe env check |

---

## Full roadmap (9 items pending — 94% complete)

Lifted directly from [`nextjs-reusable-library-150.md`](./nextjs-reusable-library-150.md). Items are tagged with the implementation phase and current status. The "Phase" column drives the build order in future sessions.

> **Note:** items marked `(registry)` already exist in the JB / VibeKit JSON registry at [`jb-components.md`](./jb-components.md) — they'll graduate to the GitHub registry only when re-touched.
>
> Items marked `(pattern)` are documented in a framework guide (multi-tenant.md, audit-log.md, etc.) — they're ready to graduate to installable primitives by extracting the source.

### 1. Auth & Session (10) — 10/10 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 1 | ✅ | useCurrentUser | 1 | shipped |
| 2 | ✅ | requireAuth (server) | 2 | shipped |
| 3 | ✅ | requireRole (server) | 2 | shipped |
| 4 | ✅ | AuthGuard | 5 | shipped |
| 5 | ✅ | RoleGate | 1 | shipped as `role-gate` |
| 6 | ✅ | usePermissions | 5 | shipped |
| 7 | ✅ | Impersonation system | 9 | shipped as `impersonation` (signed cookie + 2h ceiling + audit + resolveImpersonatedUser) |
| 8 | ✅ | Session refresh manager | 5 | shipped as `use-session-refresh` |
| 9 | ✅ | TwoFactorSetup | 8 | shipped as `two-factor-setup` (3-step: QR → verify → backup codes) |
| 10 | ✅ | Device/session list | 8 | shipped as `device-list` (UA-detected device icon, revoke one + revoke-others) |

### 2. Data Fetching & Caching (12) — 11/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 11 | ✅ | apiClient | 3 | shipped as `api-client` |
| 12 | ✅ | createQueryKeys | 3 | shipped as `query-keys` |
| 13 | ✅ | cacheGet / cacheSet / withCache | 7 | shipped as `cache-redis` |
| 14 | ✅ | invalidateCache | 7 | shipped (wildcards via SCAN + tag helpers) |
| 15 | ✅ | useOptimisticMutation | 3 | shipped |
| 16 | ✅ | usePaginatedQuery | 3 | shipped |
| 17 | ✅ | useInfiniteScroll | 4 | shipped |
| 18 | ✅ | Stale-while-revalidate Redis layer | 9 | shipped as `use-swr-cache` (withSwrCache + invalidateSwr, in-process stampede dedupe) |
| 19 | ✅ | prefetchOnHover | 7 | shipped |
| 20 | ⏳ | Request deduplication | — | React Query already handles |
| 21 | ✅ | useDebouncedQuery | 3 | shipped |
| 22 | ✅ | Polling manager | 7 | shipped as `use-polling` (pauses on hidden) |

### 3. Forms & Validation (12) — 11/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 23 | ✅ | Form wrapper | (registry) | Shipped at `vibekit.desishub.com/r/form.json` — shadcn fallback |
| 24 | ✅ | FormField (one-row labeled field) | 3 | shipped as `field` |
| 25 | ✅ | FormSelect / FormCombobox | 3 | shipped as `form-combobox` (async + static) |
| 26 | ✅ | FormDatePicker | 3 | shipped (FormDateRange = Phase 6+) |
| 27 | ✅ | FormFileUpload | 8 | shipped as `form-file-upload` (drag-drop, multi-file, RHF-bound, composes `upload-file`) |
| 28 | ⏳ | FormMultiStep | (registry) | Shipped as `multi-step-form` in JB registry |
| 29 | ✅ | Shared Zod schemas | 10 | shipped as `zod-schemas` (email/password/slug/phone/url/money/listQuery + more, every schema trims+normalises) |
| 30 | ✅ | parseFormData (server) | 2 | shipped as `parse-form-data` |
| 31 | ✅ | useUnsavedChanges | 3 | shipped |
| 32 | ✅ | FormAutosave | 5 | shipped |
| 33 | ✅ | Field async validation | 7 | shipped as `use-async-validation` |
| 34 | ✅ | TagInput | 10 | shipped as `tag-input` (chip input, keyboard nav suggestions, dedupe + normaliser + validator + max-cap + read-only tags) |

### 4. Tables & Data Display (12) — 11/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 35 | ⏳ | DataTable | (registry) | Shipped as JB Data Table |
| 36 | ✅ | useTableState | 1 | shipped |
| 37 | ✅ | ColumnHeader | 3 | shipped |
| 38 | ✅ | Bulk actions bar | 3 | shipped as `bulk-actions-bar` |
| 39 | ✅ | DataTableToolbar | 3 | shipped |
| 40 | ✅ | EmptyState | 1 | shipped |
| 41 | ✅ | Server-side table fetcher | 5 | shipped as `server-table-fetcher` |
| 42 | ✅ | EditableCell | 6 | shipped |
| 43 | ✅ | Column resize/reorder persistence | 8 | shipped as `use-column-preferences` (+ `columnResizeHandlers`, localStorage-backed) |
| 44 | ✅ | DataGrid virtualized | 10 | shipped as `data-grid` (TanStack Virtual — sticky header, row-click, onEndReached, useColumnPreferences-aware) |
| 45 | ✅ | StatCard | 2 | shipped |
| 46 | ✅ | Timeline (vertical activity feed) | 7 | shipped as `activity-timeline` |

### 5. Feedback & Overlays (12) — 12/12 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 47 | ✅ | toast system | 4 | shipped (Sonner preset + toast.confirm extension) |
| 48 | ✅ | ConfirmDialog + useConfirm | 1 | shipped |
| 49 | ✅ | Modal / useModal | 6 | shipped (stack-aware imperative manager) |
| 50 | ✅ | Drawer | 5 | shipped (responsive side panel / bottom sheet) |
| 51 | ⏳ | CommandPalette | (registry) | Shipped as `command-palette` |
| 52 | ✅ | LoadingButton | 1 | shipped |
| 53 | ✅ | Skeleton library | 3 | shipped as `skeletons` (Table/CardGrid/DetailPage/Form/StatRow) |
| 54 | ✅ | ErrorBoundary + fallback | 3 | shipped |
| 55 | ✅ | Global loading bar | 6 | shipped |
| 56 | ✅ | Tooltip standardized | 5 | shipped |
| 57 | ✅ | CopyButton | 1 | shipped |
| 58 | ✅ | Banner / announcement | 6 | shipped |

### 6. File & Media (8) — 8/8 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 59 | ✅ | uploadFile | 6 | shipped (client XHR with progress + abort) |
| 60 | ✅ | ImageUpload | 6 | shipped (drag-drop + preview + validation + progress) |
| 61 | ✅ | Avatar + fallback | 2 | shipped (counted in layout) |
| 62 | ✅ | FilePreview | 4 | shipped |
| 63 | ✅ | Signed URL generator | 6 | shipped (R2/S3 PUT + GET) |
| 64 | ✅ | Gallery / lightbox | 8 | shipped as `gallery` (responsive grid + keyboard-nav lightbox + optional download) |
| 65 | ✅ | CSV import wizard | 9 | shipped as `csv-import` (4-step Upload → Map → Validate → Import, client-side parser) |
| 66 | ✅ | Dropzone | 10 | shipped (generic drag-drop with `{accepted, rejected}` callback, MIME globs + extensions, max-size, multiple toggle) |

### 7. Documents & Export (6) — 5/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 67 | ⏳ | PDFDocument templates | (registry) | Shipped as `printable-templates` |
| 68 | ✅ | exportToExcel | 4 | shipped (lazy-loaded xlsx) |
| 69 | ✅ | exportToCSV | 4 | shipped |
| 70 | ✅ | generateInvoicePDF | 9 | shipped as `invoice-pdf` (@react-pdf/renderer, paid/due/overdue status, line-items, totals) |
| 71 | ✅ | Print stylesheet + PrintButton | 7 | shipped as `print-button` |
| 72 | ✅ | Report builder | 10 | shipped as `report-builder` (config → PDF or XLSX, shared schema, lazy xlsx, currency/number/percent/date formatters) |

### 8. Notifications & Email (8) — 8/8 shipped ✨ COMPLETE (+ NotificationBell bonus)

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 73 | ✅ | React Email templates | 5–8 | shipped (BaseLayout + WelcomeEmail + ResetPasswordEmail + InvoiceEmail with paid/due/overdue variants) |
| 74 | ✅ | sendEmail | 3 | shipped (Resend wrapper with dev-preview) |
| 75 | ⏳ | In-app notification system | (registry) | Shipped as `notification-center` |
| 76 | ✅ | notify(userId, type, data) | 6 | shipped (defineNotify — typed, prefs-aware, in-app + email) |
| 77 | ✅ | Notification preferences UI | 8 | shipped as `notification-preferences` (channel × type Switch matrix, debounced autosave) |
| 78 | ✅ | NotificationBell | 10 | shipped (topbar popover, unread badge, mark-read + mark-all-read, polling) |
| 79 | ✅ | Email verification flow | 9 | shipped as `email-verification` (hashed single-use 24h tokens + sendEmailVerification + verifyEmailToken + cron pruner) |
| 80 | ✅ | Digest scheduler | 9 | shipped as `digest-scheduler` (per-cadence batch, marks digestSentAt, QStash-friendly) |

### 9. Payments & Billing (6) — 2/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 81 | ✅ | Stripe webhook handler | 7 | shipped (typed event router with idempotency) |
| 82 | ⏳ | PricingTable | (registry) | Shipped as `saas-billing` |
| 83 | ⏳ | CheckoutButton | (registry) | Shipped via Stripe UI |
| 84 | ✅ | Billing portal link | 7 | shipped as `billing-portal` |
| 85 | ⏳ | useSubscription | (registry) | Shipped as `saas-subscription` |
| 86 | ⏳ | Usage metering | (registry) | Shipped as part of `saas-subscription` |

### 10. Layout & Navigation (6 + 1 bonus) — 6/6 shipped ✨ COMPLETE + theme-toggle

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 87 | ✅ | AppShell | 4 | shipped |
| 88 | ✅ | Sidebar with active state | 4 | shipped |
| 89 | ✅ | Breadcrumbs | 2 | shipped |
| 90 | ✅ | PageHeader | 2 | shipped |
| 91 | ✅ | TabNav | 4 | shipped (path + query modes) |
| 92 | ✅ | Org/workspace switcher | 10 | shipped as `org-switcher` (searchable, role badge, create-workspace action) |
| 104 | ✅ | ThemeToggle | 6 | shipped (dropdown + cycle variants — also counted in State/Hooks/DX) |

### 11. Utilities & Infra (8) — 8/8 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 93 | ✅ | db singleton | 9 | shipped as `db` (Prisma client on `globalThis`, HMR-safe, dev/prod log levels) |
| 94 | ✅ | tenantScope helper | 10 | shipped as `tenant-scope` (Prisma extension — read scope + write inject, configurable column + included/excluded models) |
| 95 | ✅ | Audit log system | 10 | shipped as `audit-log` (recordAudit + withAudit Prisma middleware + getAuditLog reader, AuditLog model schema in JSDoc) |
| 96 | ✅ | formatters | 1 | shipped |
| 97 | ✅ | rateLimit | 2 | shipped |
| 98 | ✅ | Feature flags | 5 | shipped (env + dynamic evaluator + FlagsProvider + useFlag) |
| 99 | ✅ | Error/event monitoring wrapper | 8 | shipped as `monitoring` (adapter shim — default console JSON-line, swap in Sentry/Axiom/Datadog) |
| 100 | ✅ | Soft-delete + restore | 5 | shipped (Prisma extension + helpers) |

### 12. State, Hooks & DX (12) — 11/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 101 | ✅ | useLocalStorage | 1 | shipped (also covers useSessionStorage via small variant later) |
| 102 | ✅ | useMediaQuery + useBreakpoint | 1 | shipped |
| 103 | ⏳ | cn() | — | Shipped by shadcn init |
| 104 | ✅ | ThemeProvider + ThemeToggle | 6 | shipped as `theme-toggle` (ThemeProvider from next-themes lives in root layout) |
| 105 | ✅ | useKeyboardShortcuts | 5 | shipped |
| 106 | ✅ | useClipboard | 1 | shipped |
| 107 | ✅ | useDebounce / useThrottle | 2 | shipped (use-debounce + use-throttle) |
| 108 | ✅ | usePrevious | 2 | shipped (useIsMounted in a future micro-batch) |
| 109 | ✅ | useEventListener | 2 | shipped |
| 110 | ✅ | useIntersectionObserver | 2 | shipped |
| 111 | ✅ | ClientOnly / NoSSR | 2 | shipped as `client-only` |
| 112 | ✅ | invariant / assert / exhaustive | 2 | shipped as `invariant` |

### 13. Search, Filtering & Views (10) — 10/10 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 113 | ✅ | GlobalSearch | 6 | shipped (⌘K palette, debounced, grouped, recents) |
| 114 | ✅ | useFilters | 5 | shipped (typed URL-synced; multi/bool/range/single) |
| 115 | ✅ | FilterBar | 8 | shipped (FilterBar.Multi / Single / Bool / DateRange / NumRange — reads/writes `useFilters`) |
| 116 | ✅ | Saved views | 9 | shipped as `saved-views` (per-page-key URL snapshots, create/rename/delete/set-default) |
| 117 | ✅ | SearchInput | 4 | shipped |
| 118 | ✅ | Faceted filter counts | 10 | shipped as `facet-counts` (single-roundtrip Promise.all, 'exclude-own-value' computation, toSegmentCounts adapter) |
| 119 | ✅ | buildPrismaWhere | 4 | shipped (with buildPrismaOrderBy) |
| 120 | ✅ | SortDropdown | 4 | shipped |
| 121 | ✅ | Recently viewed | 8 | shipped as `recently-viewed` (cross-entity localStorage history, type filter, capped at 20) |
| 122 | ✅ | Quick filters / segments | 9 | shipped as `quick-filters` (preset chip row above lists, optional server-counts) |

### 14. Realtime & Collaboration (8) — 8/8 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 123 | ✅ | SSE/WebSocket manager | 7 | shipped as `sse-channel` (server route + useSseChannel client) |
| 124 | ✅ | usePresence | 7 | shipped (heartbeat + polled member list) |
| 125 | ✅ | Live cursors / live updates | 9 | shipped as `live-cursors` (throttled publish, 5s stale, deterministic colour-from-id) |
| 126 | ✅ | TypingIndicator | 8 | shipped (`useTypingPublisher` + `<TypingIndicator>` — debounced start/stop on `useChannel`) |
| 127 | ✅ | Comments with mentions | 9 | shipped as `comments-thread` (keyboard mention picker, live updates over useChannel, `@[Name](id)` storage) |
| 128 | ✅ | useChannel | 8 | shipped (transport-agnostic pub/sub backed by `useSseChannel` + POST egress) |
| 129 | ✅ | Collaborative lock | 8 | shipped (`useCollaborativeLock` + `<LockBanner>` + `<LockBadge>` — acquire/release/takeover) |
| 130 | ✅ | Activity broadcast | 8 | shipped as `activity-broadcast` (server-side parallel-sink fanout via Promise.allSettled) |

### 15. Dashboards & Charts (8) — 8/8 shipped ✨ COMPLETE + line/bar/area bonus

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 131 | ✅ | ChartCard | 8 | shipped (uniform dashboard wrapper: title + actions + fullscreen toggle + loading/empty states) |
| 132 | ✅ | LineChart / BarChart / AreaChart | 10 | shipped as `line-chart` + `bar-chart` + `area-chart` (themed Recharts wrappers, generic over row shape, gradient + stacked + horizontal modes) |
| 133 | ✅ | DonutChart / PieChart | 7 | shipped as `donut-chart` (with centre label, legend, theme palette) |
| 134 | ✅ | Sparkline | 5 | shipped |
| 135 | ✅ | MetricGrid | 5 | shipped (with trend + comparison + sparkline slot + skeleton) |
| 136 | ✅ | DateRangePicker (dashboard) | 6 | shipped (presets + 2-month custom calendar) |
| 137 | ✅ | HeatmapCalendar | 7 | shipped (configurable thresholds + tooltips + click handler) |
| 138 | ✅ | FunnelChart | 7 | shipped (auto per-stage conversion %, Recharts-based) |

### 16. Security, Compliance & Ops (12) — 12/12 shipped ✨ COMPLETE

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 139 | ✅ | CSRF + security headers | 6 | shipped as `security-headers` (CSP/HSTS/Permissions-Policy + same-origin CSRF check) |
| 140 | ✅ | Input sanitizer | 6 | shipped (sanitizeHtml + strict + sanitizeUrl, isomorphic) |
| 141 | ✅ | Idempotency middleware | 4 | shipped |
| 142 | ✅ | Webhook signature verifier | 4 | shipped |
| 143 | ✅ | Data export (GDPR) | 9 | shipped as `data-export` (zip-of-JSON per-model, R2/S3 upload, 7-day signed link email) |
| 144 | ✅ | Account deletion flow | 9 | shipped as `account-deletion` (soft → 30-day grace → cascade purge, confirmation email) |
| 145 | ✅ | Health-check endpoints | 4 | shipped (healthz + readyz) |
| 146 | ✅ | Seed + factory system | 5 | shipped as `seed-factory` |
| 147 | ✅ | Background job runner | 6 | shipped as `background-jobs` (Upstash QStash, signature verified, Zod-validated payload) |
| 148 | ✅ | Cron scheduler | 6 | shipped (jobs.enqueue with `cron` option uses QStash Schedules) |
| 149 | ✅ | Maintenance mode | 7 | shipped (full-page lockout + admin banner + env check) |
| 150 | ✅ | env validator | 1 | shipped as `env-validator` |

---

## Phase plan (suggested order)

- **Phase 1** (✅ shipped — 12 items): foundational hooks, URL state, feedback primitives, formatters, env validator. The compounders.
- **Phase 2** (✅ shipped — 15 items): server auth guards (requireAuth/requireRole), server Zod validator (parse-form-data), Upstash rate-limit, the small universal hooks (useDebounce/useThrottle/useEventListener/useIntersectionObserver/usePrevious), the standard layout chrome (Avatar+AvatarGroup, PageHeader, Breadcrumbs), StatCard, ClientOnly, invariant.
- **Phase 3** (✅ shipped — 15 items): Form wrappers (field/form-combobox/form-date-picker/use-unsaved-changes), data-fetching suite (api-client/query-keys/use-optimistic-mutation/use-paginated-query/use-debounced-query), email (send-email), data-table chrome (column-header/data-table-toolbar/bulk-actions-bar), error-boundary, skeletons.
- **Phase 4** (✅ shipped — 14 items): the shell completes (app-shell, sidebar, tab-nav), search/filtering (search-input, sort-dropdown, build-prisma-where), document export (CSV + lazy-xlsx), file preview, security/ops (idempotency, webhook-verifier, health-endpoints), use-infinite-scroll, toast preset.
- **Phase 5** (✅ shipped — 15 items): auth chrome completes (auth-guard, use-permissions, use-session-refresh), table chain completes (server-table-fetcher), useFilters, useKeyboardShortcuts, FormAutosave, Drawer, Tooltip, MetricGrid + Sparkline (charts category new), feature-flags, soft-delete, seed-factory, React Email templates (BaseLayout + Welcome).
- **Phase 6** (✅ shipped — 15 items): file uploads vertical complete (signed-url + upload-file + image-upload), notify() (in-app + email helper), reset-password-email, security-headers (CSP/HSTS/CSRF), input-sanitizer, background-jobs (QStash + cron), global-search (⌘K palette), date-range-picker, editable-cell, theme-toggle, modal (imperative stack-aware), banner, global-loading-bar — closes Feedback (12/12 ✨) and Layout (5/6).
- **Phase 7** (✅ shipped — 14 items): caching layer (cache-redis + use-polling + prefetch-on-hover), payments (stripe-webhook-handler + billing-portal — new category), realtime (sse-channel + use-presence — new category), charts (donut-chart + funnel-chart + heatmap-calendar — closes the dashboard chart surface), activity-timeline, use-async-validation, print-button, maintenance-mode. **100-item milestone crossed (67%).**
- **Phase 8** (✅ shipped — 15 items): auth chrome completes (two-factor-setup + device-list — Auth at 9/10), FormFileUpload, useColumnPreferences, gallery (lightbox), notification-preferences UI, invoice-email, monitoring wrapper, FilterBar (compound API) + recently-viewed (Search at 7/10), realtime collaboration grows from 2/8 to 6/8 (useChannel + typing-indicator + collaborative-lock + activity-broadcast), chart-card (Charts at 7/8). **115-item milestone (77%).**
- **Phase 9** (✅ shipped — 13 items): closes four categories at once — **Auth (10/10 ✨)** via impersonation; **Notifications & Email (8/8 ✨)** via email-verification + digest-scheduler; **Realtime & Collaboration (8/8 ✨)** via live-cursors + comments-thread; **Security/Ops (12/12 ✨)** via data-export (GDPR) + account-deletion. Also: `db` Prisma singleton, `use-swr-cache` (stale-while-revalidate), `csv-import` wizard, `invoice-pdf` (@react-pdf/renderer), `saved-views`, `quick-filters`. **128-item milestone (85%).**
- **Phase 10** (✅ shipped — 13 items): five more categories close ✨. **Utilities (8/8 ✨)** via tenant-scope + audit-log. **Search (10/10 ✨)** via facet-counts. **Layout (6/6 ✨)** via org-switcher. **File & Media (8/8 ✨)** via dropzone. **Charts (8/8 ✨)** via line-chart + bar-chart + area-chart + chart-card. Plus the virtualised `data-grid` (Tables 11/12), config-driven `report-builder`, `notification-bell`, `zod-schemas`, and `tag-input`. **141-item milestone (94%).**
- **Phase 11** (the final 9): impersonation banner UI / dashboard, an in-app notification feed page, payments helpers (PricingTable, CheckoutButton, useSubscription — `(registry)` graduations), FormMultiStep + DataTable graduations, and the remaining `(pattern)` items.

Each phase is a couple of dedicated sessions of focused work. The roadmap above is the canonical tracker — update item status as things ship.

**Progress:** 141 / 150 shipped (94%) 🎉. **Nine complete categories ✨:** Auth (10/10), Notifications & Email (8/8), Realtime & Collaboration (8/8), Security/Ops (12/12), Feedback (12/12), File & Media (8/8), Search (10/10), Layout (6/6), Charts (8/8), Utilities (8/8). Within striking distance of 150: Tables (11/12), Data Fetching (11/12), Documents (5/6), State/Hooks/DX (11/12), Forms (11/12), Payments (2/6). Net greenfield work left: <10 items; remaining gaps are mostly `(registry)` graduations.

---

## Why GitHub registry instead of the JSON-endpoint approach

Existing JB / VibeKit components stay on `vibekit.desishub.com/r/{slug}.json` (hand-rolled, source-as-string in `registry-data.ts`). NEW items go through the GitHub registry because:

| | JSON-endpoint approach (legacy) | GitHub registry (new) |
|---|---|---|
| Source location | TypeScript template-literal strings in `registry-data.ts` | Real `.tsx`/`.ts` files under `registry/<category>/` |
| Lintable / type-checked | ❌ | ✅ |
| Diffable | Ugly | Clean |
| Versioning | None — always HEAD | Git tags, branches, SHAs |
| Distribution | Self-hosted endpoint | GitHub's CDN, free |
| CLI commands | `add` only | `add`, `list`, `search`, `view`, `validate` |
| Install URL | `vibekit.desishub.com/r/slug.json` | `MUKE-coder/vibekit/slug` |

Migration of existing 32 components from the legacy approach is out of scope right now — they keep working as-is. New items + any future fixes to existing items adopt the GitHub approach.

---

_Last updated: 2026-06-02 · Phase 10 shipped · 141/150 (94%) · Phase 11 queued_
