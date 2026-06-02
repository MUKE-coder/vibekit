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

## Shipped — 86 items

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

---

## Full roadmap (64 items pending — 57% complete)

Lifted directly from [`nextjs-reusable-library-150.md`](./nextjs-reusable-library-150.md). Items are tagged with the implementation phase and current status. The "Phase" column drives the build order in future sessions.

> **Note:** items marked `(registry)` already exist in the JB / VibeKit JSON registry at [`jb-components.md`](./jb-components.md) — they'll graduate to the GitHub registry only when re-touched.
>
> Items marked `(pattern)` are documented in a framework guide (multi-tenant.md, audit-log.md, etc.) — they're ready to graduate to installable primitives by extracting the source.

### 1. Auth & Session (10) — 7/10 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 1 | ✅ | useCurrentUser | 1 | shipped |
| 2 | ✅ | requireAuth (server) | 2 | shipped |
| 3 | ✅ | requireRole (server) | 2 | shipped |
| 4 | ✅ | AuthGuard | 5 | shipped |
| 5 | ✅ | RoleGate | 1 | shipped as `role-gate` |
| 6 | ✅ | usePermissions | 5 | shipped |
| 7 | ⏳ | Impersonation system | 6+ | Larger — admin "login as user" |
| 8 | ✅ | Session refresh manager | 5 | shipped as `use-session-refresh` |
| 9 | ⏳ | TwoFactorSetup | 6+ | TOTP enrollment UI |
| 10 | ⏳ | Device/session list | 6+ | Active sessions UI |

### 2. Data Fetching & Caching (12) — 6/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 11 | ✅ | apiClient | 3 | shipped as `api-client` |
| 12 | ✅ | createQueryKeys | 3 | shipped as `query-keys` |
| 13 | ⏳ | cacheGet / cacheSet / withCache | 5+ | (pattern — master_prompt.md REDIS CACHING) |
| 14 | ⏳ | invalidateCache | 5+ | Tag-based wildcard |
| 15 | ✅ | useOptimisticMutation | 3 | shipped |
| 16 | ✅ | usePaginatedQuery | 3 | shipped |
| 17 | ✅ | useInfiniteScroll | 4 | shipped |
| 18 | ⏳ | Stale-while-revalidate Redis layer | 5+ | |
| 19 | ⏳ | prefetchOnHover | 5+ | |
| 20 | ⏳ | Request deduplication | — | React Query already handles |
| 21 | ✅ | useDebouncedQuery | 3 | shipped |
| 22 | ⏳ | Polling manager | 5+ | Pauses on tab hidden |

### 3. Forms & Validation (12) — 7/12 shipped (no Phase 6 additions)

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 23 | ✅ | Form wrapper | (registry) | Shipped at `vibekit.desishub.com/r/form.json` — shadcn fallback |
| 24 | ✅ | FormField (one-row labeled field) | 3 | shipped as `field` |
| 25 | ✅ | FormSelect / FormCombobox | 3 | shipped as `form-combobox` (async + static) |
| 26 | ✅ | FormDatePicker | 3 | shipped (FormDateRange = Phase 6+) |
| 27 | ⏳ | FormFileUpload | 6+ | R2/UploadThing integration |
| 28 | ⏳ | FormMultiStep | (registry) | Shipped as `multi-step-form` in JB registry |
| 29 | ⏳ | Shared Zod schemas | (pattern) | master_prompt.md FORM RULES |
| 30 | ✅ | parseFormData (server) | 2 | shipped as `parse-form-data` |
| 31 | ✅ | useUnsavedChanges | 3 | shipped |
| 32 | ✅ | FormAutosave | 5 | shipped |
| 33 | ⏳ | Field async validation | 6+ | Debounced uniqueness checks |
| 34 | ⏳ | TagInput | (registry) | Shipped as `advanced-form-elements` |

### 4. Tables & Data Display (12) — 8/12 shipped

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
| 43 | ⏳ | Column resize/reorder persistence | 7+ | |
| 44 | ⏳ | DataGrid virtualized | 7+ | TanStack Virtual |
| 45 | ✅ | StatCard | 2 | shipped |
| 46 | ⏳ | Timeline (vertical activity feed) | 7+ | Different from alternating-timeline (already shipped) |

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

### 6. File & Media (8) — 5/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 59 | ✅ | uploadFile | 6 | shipped (client XHR with progress + abort) |
| 60 | ✅ | ImageUpload | 6 | shipped (drag-drop + preview + validation + progress) |
| 61 | ✅ | Avatar + fallback | 2 | shipped (counted in layout) |
| 62 | ✅ | FilePreview | 4 | shipped |
| 63 | ✅ | Signed URL generator | 6 | shipped (R2/S3 PUT + GET) |
| 64 | ⏳ | Gallery / lightbox | 7+ | |
| 65 | ⏳ | CSV import wizard | 7+ | Upload → map → validate → import |
| 66 | ⏳ | Dropzone | (registry) | Shipped via JB File Storage UI |

### 7. Documents & Export (6) — 2/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 67 | ⏳ | PDFDocument templates | (registry) | Shipped as `printable-templates` |
| 68 | ✅ | exportToExcel | 4 | shipped (lazy-loaded xlsx) |
| 69 | ✅ | exportToCSV | 4 | shipped |
| 70 | ⏳ | generateInvoicePDF | 5+ | (extends printable-templates) |
| 71 | ⏳ | Print stylesheet + PrintButton | 5+ | |
| 72 | ⏳ | Report builder | 5+ | Config → PDF/Excel |

### 8. Notifications & Email (8) — 4/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 73 | ✅ | React Email templates | 5–6 | shipped (BaseLayout + WelcomeEmail + ResetPasswordEmail) |
| 74 | ✅ | sendEmail | 3 | shipped (Resend wrapper with dev-preview) |
| 75 | ⏳ | In-app notification system | (registry) | Shipped as `notification-center` |
| 76 | ✅ | notify(userId, type, data) | 6 | shipped (defineNotify — typed, prefs-aware, in-app + email) |
| 77 | ⏳ | Notification preferences UI | 7+ | |
| 78 | ⏳ | NotificationBell | (registry) | Shipped as part of `notification-center` |
| 79 | ⏳ | Email verification flow | 7+ | (covered partially by Better Auth UI) |
| 80 | ⏳ | Digest scheduler | 7+ | Batches into daily/weekly |

### 9. Payments & Billing (6) — 0/6 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 81 | ⏳ | Stripe webhook handler | 3 | (partial via Stripe UI; standalone helper useful) |
| 82 | ⏳ | PricingTable | (registry) | Shipped as `saas-billing` |
| 83 | ⏳ | CheckoutButton | (registry) | Shipped via Stripe UI |
| 84 | ⏳ | Billing portal link | 3 | One-click to Stripe customer portal |
| 85 | ⏳ | useSubscription | (registry) | Shipped as `saas-subscription` |
| 86 | ⏳ | Usage metering | (registry) | Shipped as part of `saas-subscription` |

### 10. Layout & Navigation (6 + 1 bonus) — 5/6 shipped + theme-toggle

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 87 | ✅ | AppShell | 4 | shipped |
| 88 | ✅ | Sidebar with active state | 4 | shipped |
| 89 | ✅ | Breadcrumbs | 2 | shipped |
| 90 | ✅ | PageHeader | 2 | shipped |
| 91 | ✅ | TabNav | 4 | shipped (path + query modes) |
| 92 | ⏳ | Org/workspace switcher | (registry) | Shipped as part of `org-team-ui` |
| 104 | ✅ | ThemeToggle | 6 | shipped (dropdown + cycle variants — also counted in State/Hooks/DX) |

### 11. Utilities & Infra (8) — 4/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 93 | ⏳ | db singleton | (pattern) | master_prompt.md → Prisma section |
| 94 | ⏳ | tenantScope helper | (pattern) | multi-tenant.md → scopedDb |
| 95 | ⏳ | Audit log system | (pattern) | audit-log.md → recordAudit + UI |
| 96 | ✅ | formatters | 1 | shipped |
| 97 | ✅ | rateLimit | 2 | shipped |
| 98 | ✅ | Feature flags | 5 | shipped (env + dynamic evaluator + FlagsProvider + useFlag) |
| 99 | ⏳ | Error/event monitoring wrapper | 6+ | Sentry init + captureError |
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

### 13. Search, Filtering & Views (10) — 5/10 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 113 | ✅ | GlobalSearch | 6 | shipped (⌘K palette, debounced, grouped, recents) |
| 114 | ✅ | useFilters | 5 | shipped (typed URL-synced; multi/bool/range/single) |
| 115 | ⏳ | FilterBar | 5+ | Composable faceted filters (DataTableToolbar covers most) |
| 116 | ⏳ | Saved views | 5+ | Named filter+sort+column combos |
| 117 | ✅ | SearchInput | 4 | shipped |
| 118 | ⏳ | Faceted filter counts | 5+ | Server-side counts |
| 119 | ✅ | buildPrismaWhere | 4 | shipped (with buildPrismaOrderBy) |
| 120 | ✅ | SortDropdown | 4 | shipped |
| 121 | ⏳ | Recently viewed | 5+ | Cross-entity history |
| 122 | ⏳ | Quick filters / segments | 5+ | Preset filters |

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

### 15. Dashboards & Charts (8) — 3/8 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 131 | ⏳ | ChartCard | (registry) | Shipped as part of `charts-grid` |
| 132 | ⏳ | LineChart / BarChart / AreaChart | (registry) | Shipped as part of `charts-grid` |
| 133 | ⏳ | DonutChart / PieChart | (registry) | Shipped as part of `charts-grid` |
| 134 | ✅ | Sparkline | 5 | shipped |
| 135 | ✅ | MetricGrid | 5 | shipped (with trend + comparison + sparkline slot + skeleton) |
| 136 | ✅ | DateRangePicker (dashboard) | 6 | shipped (presets + 2-month custom calendar) |
| 137 | ⏳ | HeatmapCalendar | 4 | GitHub-style contribution grid |
| 138 | ⏳ | FunnelChart | 4 | Conversion funnel |

### 16. Security, Compliance & Ops (12) — 9/12 shipped

| # | Status | Item | Phase | Notes |
|---|---|---|---|---|
| 139 | ✅ | CSRF + security headers | 6 | shipped as `security-headers` (CSP/HSTS/Permissions-Policy + same-origin CSRF check) |
| 140 | ✅ | Input sanitizer | 6 | shipped (sanitizeHtml + strict + sanitizeUrl, isomorphic) |
| 141 | ✅ | Idempotency middleware | 4 | shipped |
| 142 | ✅ | Webhook signature verifier | 4 | shipped |
| 143 | ⏳ | Data export (GDPR) | 7+ | "Export all my data" |
| 144 | ⏳ | Account deletion flow | 7+ | Soft → grace → purge |
| 145 | ✅ | Health-check endpoints | 4 | shipped (healthz + readyz) |
| 146 | ✅ | Seed + factory system | 5 | shipped as `seed-factory` |
| 147 | ✅ | Background job runner | 6 | shipped as `background-jobs` (Upstash QStash, signature verified, Zod-validated payload) |
| 148 | ✅ | Cron scheduler | 6 | shipped (jobs.enqueue with `cron` option uses QStash Schedules) |
| 149 | ⏳ | Maintenance mode | 7+ | Flag-driven |
| 150 | ✅ | env validator | 1 | shipped as `env-validator` |

---

## Phase plan (suggested order)

- **Phase 1** (✅ shipped — 12 items): foundational hooks, URL state, feedback primitives, formatters, env validator. The compounders.
- **Phase 2** (✅ shipped — 15 items): server auth guards (requireAuth/requireRole), server Zod validator (parse-form-data), Upstash rate-limit, the small universal hooks (useDebounce/useThrottle/useEventListener/useIntersectionObserver/usePrevious), the standard layout chrome (Avatar+AvatarGroup, PageHeader, Breadcrumbs), StatCard, ClientOnly, invariant.
- **Phase 3** (✅ shipped — 15 items): Form wrappers (field/form-combobox/form-date-picker/use-unsaved-changes), data-fetching suite (api-client/query-keys/use-optimistic-mutation/use-paginated-query/use-debounced-query), email (send-email), data-table chrome (column-header/data-table-toolbar/bulk-actions-bar), error-boundary, skeletons.
- **Phase 4** (✅ shipped — 14 items): the shell completes (app-shell, sidebar, tab-nav), search/filtering (search-input, sort-dropdown, build-prisma-where), document export (CSV + lazy-xlsx), file preview, security/ops (idempotency, webhook-verifier, health-endpoints), use-infinite-scroll, toast preset.
- **Phase 5** (✅ shipped — 15 items): auth chrome completes (auth-guard, use-permissions, use-session-refresh), table chain completes (server-table-fetcher), useFilters, useKeyboardShortcuts, FormAutosave, Drawer, Tooltip, MetricGrid + Sparkline (charts category new), feature-flags, soft-delete, seed-factory, React Email templates (BaseLayout + Welcome).
- **Phase 6** (✅ shipped — 15 items): file uploads vertical complete (signed-url + upload-file + image-upload), notify() (in-app + email helper), reset-password-email, security-headers (CSP/HSTS/CSRF), input-sanitizer, background-jobs (QStash + cron), global-search (⌘K palette), date-range-picker, editable-cell, theme-toggle, modal (imperative stack-aware), banner, global-loading-bar — closes Feedback (12/12 ✨) and Layout (5/6).
- **Phase 7+** (the long tail — ~45 truly greenfield items left, ~20 more graduate from `(registry)` / `(pattern)`): impersonation, 2FA, realtime collaboration (SSE/WebSocket, presence, typing, comments, locks, activity broadcast), GDPR export, virtualized grid, gallery/lightbox, CSV import wizard, saved views, faceted filter counts, HeatmapCalendar/FunnelChart, FormFileUpload, notification preferences UI, more React Email templates (invoice/notification), column resize persistence, Stripe webhook handler, account deletion flow, maintenance mode, monitoring wrapper, the cache layer (withCache/invalidateCache/stale-while-revalidate), usePresence, useChannel, prefetchOnHover, polling manager, async field validation, generateInvoicePDF, more.

Each phase is a couple of dedicated sessions of focused work. The roadmap above is the canonical tracker — update item status as things ship.

**Progress:** 86 / 150 shipped (57%). Of the ~64 pending items, ~18 already exist as `(registry)` or `(pattern)` entries — they graduate to GitHub-registry installs when re-touched. Net greenfield items left: ~46, queued for Phase 7+ across multiple focused sessions. **Feedback category is now COMPLETE** (12/12).

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

_Last updated: 2026-05-18 · Phase 6 shipped · Phase 7+ queued_
