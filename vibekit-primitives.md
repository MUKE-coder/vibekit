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

## Shipped — 27 items

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

---

## Full roadmap (123 items pending — 18% complete)

Lifted directly from [`nextjs-reusable-library-150.md`](./nextjs-reusable-library-150.md). Items are tagged with the implementation phase and current status. The "Phase" column drives the build order in future sessions.

> **Note:** items marked `(registry)` already exist in the JB / VibeKit JSON registry at [`jb-components.md`](./jb-components.md) — they'll graduate to the GitHub registry only when re-touched.
>
> Items marked `(pattern)` are documented in a framework guide (multi-tenant.md, audit-log.md, etc.) — they're ready to graduate to installable primitives by extracting the source.

### 1. Auth & Session (10) — 4/10 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 1 | ✅ | useCurrentUser | 1 | shipped |
| 2 | ✅ | requireAuth (server) | 2 | shipped |
| 3 | ✅ | requireRole (server) | 2 | shipped |
| 4 | ⏳ | AuthGuard | 3 | Redirects to login + loading skeleton |
| 5 | ✅ | RoleGate | 1 | shipped as `role-gate` |
| 6 | ⏳ | usePermissions | 3 | `can(action, resource)` — pattern in multi-tenant.md |
| 7 | ⏳ | Impersonation system | 4 | Larger — admin "login as user" |
| 8 | ⏳ | Session refresh manager | 3 | BroadcastChannel cross-tab |
| 9 | ⏳ | TwoFactorSetup | 4 | TOTP enrollment UI |
| 10 | ⏳ | Device/session list | 4 | Active sessions UI |

### 2. Data Fetching & Caching (12) — 0/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 11 | ⏳ | apiClient | 2 | Typed fetch wrapper |
| 12 | ⏳ | createQueryKeys | 2 | React Query key factory |
| 13 | ⏳ | cacheGet / cacheSet / withCache | 2 | (pattern — master_prompt.md REDIS CACHING) |
| 14 | ⏳ | invalidateCache | 2 | Tag-based wildcard |
| 15 | ⏳ | useOptimisticMutation | 2 | React Query wrapper |
| 16 | ⏳ | usePaginatedQuery | 3 | Cursor/offset abstraction |
| 17 | ⏳ | useInfiniteScroll | 3 | IntersectionObserver |
| 18 | ⏳ | Stale-while-revalidate Redis layer | 3 | |
| 19 | ⏳ | prefetchOnHover | 3 | |
| 20 | ⏳ | Request deduplication | — | React Query already handles |
| 21 | ⏳ | useDebouncedQuery | 2 | Debounce + cancellation |
| 22 | ⏳ | Polling manager | 3 | Pauses on tab hidden |

### 3. Forms & Validation (12) — 2/12 shipped (Form fallback + parse-form-data)

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 23 | ✅ | Form wrapper | (registry) | Shipped at `vibekit.desishub.com/r/form.json` — shadcn fallback |
| 24 | ⏳ | FormField | 3 | Connects label/input/error/description |
| 25 | ⏳ | FormSelect / FormCombobox | 3 | Async-loading + search |
| 26 | ⏳ | FormDatePicker / FormDateRange | 3 | Calendar + ISO output |
| 27 | ⏳ | FormFileUpload | 3 | R2/UploadThing integration |
| 28 | ⏳ | FormMultiStep | (registry) | Shipped as `multi-step-form` in JB registry |
| 29 | ⏳ | Shared Zod schemas | (pattern) | master_prompt.md FORM RULES |
| 30 | ✅ | parseFormData (server) | 2 | shipped as `parse-form-data` |
| 31 | ⏳ | useUnsavedChanges | 3 | beforeunload + router intercept |
| 32 | ⏳ | FormAutosave | 3 | Debounced auto-save |
| 33 | ⏳ | Field async validation | 3 | Debounced uniqueness checks |
| 34 | ⏳ | TagInput | (registry) | Shipped as `advanced-form-elements` |

### 4. Tables & Data Display (12) — 3/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 35 | ⏳ | DataTable | (registry) | Shipped as JB Data Table |
| 36 | ✅ | useTableState | 1 | shipped |
| 37 | ⏳ | ColumnHeader | 3 | |
| 38 | ⏳ | Bulk actions bar | 3 | |
| 39 | ⏳ | DataTableToolbar | 3 | |
| 40 | ✅ | EmptyState | 1 | shipped |
| 41 | ⏳ | Server-side table fetcher | 3 | Helper that consumes useTableState output |
| 42 | ⏳ | EditableCell | 3 | Inline-edit |
| 43 | ⏳ | Column resize/reorder persistence | 4 | |
| 44 | ⏳ | DataGrid virtualized | 4 | TanStack Virtual |
| 45 | ✅ | StatCard | 2 | shipped |
| 46 | ⏳ | Timeline (vertical activity feed) | 3 | Different from alternating-timeline (already shipped) |

### 5. Feedback & Overlays (12) — 4/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 47 | ⏳ | toast system | 2 | Pre-configured Sonner |
| 48 | ✅ | ConfirmDialog + useConfirm | 1 | shipped |
| 49 | ⏳ | Modal / useModal | 3 | Stack-aware, URL-driven |
| 50 | ⏳ | Drawer | 2 | Mobile-responsive bottom sheet |
| 51 | ⏳ | CommandPalette | (registry) | Shipped as `command-palette` |
| 52 | ✅ | LoadingButton | 1 | shipped |
| 53 | ⏳ | Skeleton library | 2 | Matched per layout |
| 54 | ⏳ | ErrorBoundary + fallback | 2 | |
| 55 | ⏳ | Global loading bar | 3 | nprogress-style |
| 56 | ⏳ | Tooltip standardized | 2 | Wrapping shadcn Tooltip |
| 57 | ✅ | CopyButton | 1 | shipped |
| 58 | ⏳ | Banner / announcement | 3 | Dismissible with persistence |

### 6. File & Media (8) — 0/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 59 | ⏳ | uploadFile | 3 | R2/UploadThing wrapper |
| 60 | ⏳ | ImageUpload | 3 | Crop/resize before upload |
| 61 | ⏳ | Avatar + fallback | 2 | Initials + status indicator |
| 62 | ⏳ | FilePreview | 3 | Image/PDF inline |
| 63 | ⏳ | Signed URL generator | 3 | R2 presigned links |
| 64 | ⏳ | Gallery / lightbox | 4 | |
| 65 | ⏳ | CSV import wizard | 4 | Upload → map → validate → import |
| 66 | ⏳ | Dropzone | (registry) | Shipped via JB File Storage UI |

### 7. Documents & Export (6) — 0/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 67 | ⏳ | PDFDocument templates | (registry) | Shipped as `printable-templates` |
| 68 | ⏳ | exportToExcel | 2 | xlsx wrapper |
| 69 | ⏳ | exportToCSV | 2 | Lightweight CSV |
| 70 | ⏳ | generateInvoicePDF | 3 | (extends printable-templates) |
| 71 | ⏳ | Print stylesheet + PrintButton | 3 | |
| 72 | ⏳ | Report builder | 4 | Config → PDF/Excel |

### 8. Notifications & Email (8) — 0/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 73 | ⏳ | React Email templates | 3 | Base + welcome / reset / invoice / notification |
| 74 | ⏳ | sendEmail | 3 | Typed Resend wrapper |
| 75 | ⏳ | In-app notification system | (registry) | Shipped as `notification-center` |
| 76 | ⏳ | notify(userId, type, data) | 3 | One-call in-app + email |
| 77 | ⏳ | Notification preferences UI | 4 | |
| 78 | ⏳ | NotificationBell | (registry) | Shipped as part of `notification-center` |
| 79 | ⏳ | Email verification flow | 3 | (covered partially by Better Auth UI) |
| 80 | ⏳ | Digest scheduler | 4 | Batches into daily/weekly |

### 9. Payments & Billing (6) — 0/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 81 | ⏳ | Stripe webhook handler | 3 | (partial via Stripe UI; standalone helper useful) |
| 82 | ⏳ | PricingTable | (registry) | Shipped as `saas-billing` |
| 83 | ⏳ | CheckoutButton | (registry) | Shipped via Stripe UI |
| 84 | ⏳ | Billing portal link | 3 | One-click to Stripe customer portal |
| 85 | ⏳ | useSubscription | (registry) | Shipped as `saas-subscription` |
| 86 | ⏳ | Usage metering | (registry) | Shipped as part of `saas-subscription` |

### 10. Layout & Navigation (6) — 2/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 87 | ⏳ | AppShell | 3 | Sidebar + topbar + content, responsive |
| 88 | ⏳ | Sidebar with active state | 3 | Config-driven, nested groups, role-filtered |
| 89 | ✅ | Breadcrumbs | 2 | shipped |
| 90 | ✅ | PageHeader | 2 | shipped |
| 91 | ⏳ | TabNav | 3 | URL-synced tabs |
| 92 | ⏳ | Org/workspace switcher | (registry) | Shipped as part of `org-team-ui` |

### 11. Utilities & Infra (8) — 2/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 93 | ⏳ | db singleton | (pattern) | master_prompt.md → Prisma section |
| 94 | ⏳ | tenantScope helper | (pattern) | multi-tenant.md → scopedDb |
| 95 | ⏳ | Audit log system | (pattern) | audit-log.md → recordAudit + UI |
| 96 | ✅ | formatters | 1 | shipped |
| 97 | ✅ | rateLimit | 2 | shipped |
| 98 | ⏳ | Feature flags | 3 | useFlag + admin UI |
| 99 | ⏳ | Error/event monitoring wrapper | 3 | Sentry init + captureError |
| 100 | ⏳ | Soft-delete + restore | 3 | deletedAt pattern + Trash UI |

### 12. State, Hooks & DX (12) — 9/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 101 | ✅ | useLocalStorage | 1 | shipped (also covers useSessionStorage via small variant later) |
| 102 | ✅ | useMediaQuery + useBreakpoint | 1 | shipped |
| 103 | ⏳ | cn() | — | Shipped by shadcn init |
| 104 | ⏳ | ThemeProvider + ThemeToggle | 3 | (covered by Better Auth UI's sidebar toggle) |
| 105 | ⏳ | useKeyboardShortcuts | 3 | Global registry + help dialog |
| 106 | ✅ | useClipboard | 1 | shipped |
| 107 | ✅ | useDebounce / useThrottle | 2 | shipped (use-debounce + use-throttle) |
| 108 | ✅ | usePrevious | 2 | shipped (useIsMounted in a future micro-batch) |
| 109 | ✅ | useEventListener | 2 | shipped |
| 110 | ✅ | useIntersectionObserver | 2 | shipped |
| 111 | ✅ | ClientOnly / NoSSR | 2 | shipped as `client-only` |
| 112 | ✅ | invariant / assert / exhaustive | 2 | shipped as `invariant` |

### 13. Search, Filtering & Views (10) — 0/10 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 113 | ⏳ | GlobalSearch | 3 | Debounced multi-entity |
| 114 | ⏳ | useFilters | 2 | URL-synced (overlaps useTableState) |
| 115 | ⏳ | FilterBar | 2 | Composable faceted filters |
| 116 | ⏳ | Saved views | 3 | Named filter+sort+column combos |
| 117 | ⏳ | SearchInput | 2 | Standardized search box |
| 118 | ⏳ | Faceted filter counts | 3 | Server-side counts |
| 119 | ⏳ | buildPrismaWhere | 2 | Typed filter → Prisma where |
| 120 | ⏳ | SortDropdown | 2 | URL-synced |
| 121 | ⏳ | Recently viewed | 3 | Cross-entity history |
| 122 | ⏳ | Quick filters / segments | 3 | Preset filters |

### 14. Realtime & Collaboration (8) — 0/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 123 | ⏳ | SSE/WebSocket manager | 4 | Single multiplexed connection |
| 124 | ⏳ | usePresence | 4 | Active viewers via Redis |
| 125 | ⏳ | Live cursors / live updates | 4 | |
| 126 | ⏳ | TypingIndicator | 4 | |
| 127 | ⏳ | Comments with mentions | 4 | |
| 128 | ⏳ | useChannel | 4 | Transport-agnostic |
| 129 | ⏳ | Collaborative lock | 4 | |
| 130 | ⏳ | Activity broadcast | 4 | |

### 15. Dashboards & Charts (8) — 0/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 131 | ⏳ | ChartCard | (registry) | Shipped as part of `charts-grid` |
| 132 | ⏳ | LineChart / BarChart / AreaChart | (registry) | Shipped as part of `charts-grid` |
| 133 | ⏳ | DonutChart / PieChart | (registry) | Shipped as part of `charts-grid` |
| 134 | ⏳ | Sparkline | 2 | Tiny inline trend |
| 135 | ⏳ | MetricGrid | 2 | KPI cards with comparison |
| 136 | ⏳ | DateRangePicker (dashboard) | 2 | 7d/30d/QTD/YTD presets |
| 137 | ⏳ | HeatmapCalendar | 4 | GitHub-style contribution grid |
| 138 | ⏳ | FunnelChart | 4 | Conversion funnel |

### 16. Security, Compliance & Ops (12) — 0/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 139 | ⏳ | CSRF + security headers | 3 | Middleware preset |
| 140 | ⏳ | Input sanitizer | 3 | sanitizeHtml |
| 141 | ⏳ | Idempotency middleware | 3 | Idempotency-Key handling |
| 142 | ⏳ | Webhook signature verifier | 3 | HMAC helper |
| 143 | ⏳ | Data export (GDPR) | 4 | "Export all my data" |
| 144 | ⏳ | Account deletion flow | 4 | Soft → grace → purge |
| 145 | ⏳ | Health-check endpoints | 2 | /healthz + /readyz |
| 146 | ⏳ | Seed + factory system | 2 | Typed factories per entity |
| 147 | ⏳ | Background job runner | 4 | QStash/BullMQ |
| 148 | ⏳ | Cron scheduler | 3 | Declarative scheduled tasks |
| 149 | ⏳ | Maintenance mode | 3 | Flag-driven |
| 150 | ✅ | env validator | 1 | shipped as `env-validator` |

---

## Phase plan (suggested order)

- **Phase 1** (✅ shipped — 12 items): foundational hooks, URL state, feedback primitives, formatters, env validator. The compounders.
- **Phase 2** (✅ shipped — 15 items): server auth guards (requireAuth/requireRole), server Zod validator (parse-form-data), Upstash rate-limit, the small universal hooks (useDebounce/useThrottle/useEventListener/useIntersectionObserver/usePrevious), the standard layout chrome (Avatar+AvatarGroup, PageHeader, Breadcrumbs), StatCard, ClientOnly, invariant.
- **Phase 3** (~25 items pending): Form library (FormField/FormSelect/FormCombobox/FormDatePicker/FormFileUpload/FormAutosave/useUnsavedChanges), data-fetching wrappers (apiClient, createQueryKeys, useOptimisticMutation, usePaginatedQuery, useInfiniteScroll, useDebouncedQuery), file/media (uploadFile, ImageUpload, signed URLs, Avatar — done), email (sendEmail, React Email templates, notify), Stripe webhook handler, data-table chrome (ColumnHeader, DataTableToolbar, Bulk actions bar, server-side table fetcher), Timeline (vertical activity feed), Drawer, Skeleton library, ErrorBoundary, Tooltip standardized, AppShell + Sidebar + TabNav, AuthGuard, usePermissions, useKeyboardShortcuts.
- **Phase 4** (the long tail — ~80 items): impersonation, 2FA, realtime collaboration, GDPR export, background jobs, virtualized grid, gallery/lightbox, CSV import wizard, savedViews, presence/typing, heatmap, etc.

Each phase is a couple of dedicated sessions of focused work. The roadmap above is the canonical tracker — update item status as things ship.

**Progress:** 27 / 150 shipped (18%). Total items minus already-in-registry-or-pattern: ~110 unique greenfield items left, of which Phase 3 covers ~25.

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

_Last updated: 2026-05-18 · Phase 2 of 4 shipped_
