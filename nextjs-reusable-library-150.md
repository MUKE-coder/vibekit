# The 150 — Pre-Built Components, Helpers & Systems for Next.js CRM/ERP Projects

> A senior fullstack engineer's wishlist of everything that should already exist in a boilerplate so you never rebuild it again.
>
> **Stack assumed:** Next.js 16 (App Router) · React 19 · TypeScript 5.9 · Neon Postgres · Upstash Redis · Prisma v7 · Better Auth · React Query · Framer Motion · Zod + React Hook Form · @react-pdf/renderer · xlsx · Cloudflare R2 / UploadThing · Resend + React Email · Stripe · Tailwind v4 + shadcn/ui · Vercel · Cloudflare DNS.

---

## Table of Contents

1. [Auth & Session](#1-auth--session-110)
2. [Data Fetching & Caching](#2-data-fetching--caching-1122)
3. [Forms & Validation](#3-forms--validation-2334)
4. [Tables & Data Display](#4-tables--data-display-3546)
5. [Feedback & Overlays](#5-feedback--overlays-4758)
6. [File & Media](#6-file--media-5966)
7. [Documents & Export](#7-documents--export-6772)
8. [Notifications & Email](#8-notifications--email-7380)
9. [Payments & Billing](#9-payments--billing-8186)
10. [Layout & Navigation](#10-layout--navigation-8792)
11. [Utilities & Infra](#11-utilities--infra-93100)
12. [State, Hooks & DX](#12-state-hooks--dx-101112)
13. [Search, Filtering & Views](#13-search-filtering--views-113122)
14. [Realtime & Collaboration](#14-realtime--collaboration-123130)
15. [Dashboards & Charts](#15-dashboards--charts-131138)
16. [Security, Compliance & Ops](#16-security-compliance--ops-139150)

---

## 1. Auth & Session (1–10)

**1. `useCurrentUser()`** — Hook returning the typed session user with role/permissions. Reads from React Query cache, never refetches unnecessarily, returns `{ user, isLoading, isAuthenticated }`.

**2. `requireAuth()`** — Server helper wrapping route handlers; throws 401 if no session, returns the typed user. `const user = await requireAuth()` at the top of any handler.

**3. `requireRole(roles[])`** — Server guard checking role membership, throws 403. Composable with `requireAuth`.

**4. `<AuthGuard>`** — Client wrapper that redirects to login if unauthenticated and shows a skeleton while loading.

**5. `<RoleGate roles={[]}>`** — Conditionally renders children by role, with a `fallback` prop for the unauthorized UI.

**6. `usePermissions()`** — Returns a `can(action, resource)` function backed by a permission matrix. `if (can('delete', 'invoice'))`.

**7. Impersonation system** — Admin "login as user" with a persistent banner, one-click exit, fully audit-logged.

**8. Session refresh manager** — Silent token refresh before expiry, broadcast across tabs via `BroadcastChannel`.

**9. `<TwoFactorSetup>`** — TOTP enrollment with QR code, backup codes, and a verification step.

**10. Device/session list** — UI listing active sessions (device, location, last active) with per-session revoke.

---

## 2. Data Fetching & Caching (11–22)

**11. `apiClient`** — Typed fetch wrapper with auto auth headers, error normalization, retry logic, and configurable base URL.

**12. `createQueryKeys()`** — Factory for consistent React Query keys per entity. `keys.invoices.detail(id)`.

**13. `cacheGet` / `cacheSet`** — Typed Upstash wrappers with TTL, JSON serialization, key prefixing, and a `withCache(key, ttl, fn)` pattern.

**14. `invalidateCache(pattern)`** — Tag-based wildcard Redis invalidation; updating an invoice clears related list caches.

**15. `useOptimisticMutation()`** — React Query mutation wrapper with optimistic update, rollback on error, and toast feedback baked in.

**16. `usePaginatedQuery()`** — Handles cursor/offset pagination, exposing `loadMore`, `hasMore`, and total count.

**17. `useInfiniteScroll()`** — IntersectionObserver hook that triggers `fetchNextPage` when a sentinel enters the viewport.

**18. Stale-while-revalidate Redis layer** — Returns cached data instantly, refreshes in the background, never blocks the user.

**19. `prefetchOnHover()`** — Prefetches detail data when a user hovers a list row or link.

**20. Request deduplication** — Coalesces identical in-flight requests so five components asking for the same data trigger one fetch.

**21. `useDebouncedQuery()`** — Search hook with built-in debounce that cancels stale requests.

**22. Polling manager** — `usePolling(queryKey, interval)` that pauses when the tab is hidden and resumes on focus.

---

## 3. Forms & Validation (23–34)

**23. `<Form>` wrapper** — RHF + Zod resolver pre-wired. Pass a schema, get typed `onSubmit` and auto error display.

**24. `<FormField>`** — Connects label, input, error message, and description in one component, with variants for every input type.

**25. `<FormSelect>` / `<FormCombobox>`** — Async-loading select with search, backed by a query, handling loading/empty states.

**26. `<FormDatePicker>` / `<FormDateRange>`** — Calendar inputs returning ISO strings, timezone-aware.

**27. `<FormFileUpload>`** — Drag-drop with progress, preview, R2/UploadThing integration, and type/size validation.

**28. `<FormMultiStep>`** — Wizard with per-step validation, progress indicator, back/next, and persisted state.

**29. Shared Zod schemas** — Single source of truth for entity validation used on client and server. `invoiceSchema` imported both places.

**30. `parseFormData()`** — Server helper validating the body against Zod, returning typed data or a 422 with field errors.

**31. `useUnsavedChanges()`** — Warns before navigation when a form is dirty (`beforeunload` + router intercept).

**32. `<FormAutosave>`** — Debounced auto-save with a "saving/saved" indicator.

**33. Field-level async validation** — Debounced uniqueness checks (email taken, slug exists) without a full submit.

**34. `<TagInput>`** — Multi-value chip input with create/remove and autocomplete from existing tags.

---

## 4. Tables & Data Display (35–46)

**35. `<DataTable>`** — TanStack Table wrapper with sorting, filtering, pagination, column visibility, and row selection, all controlled via URL state.

**36. `useTableState()`** — Syncs table sort/filter/page to URL searchParams so views are shareable and bookmarkable.

**37. `<ColumnHeader>`** — Sortable header with direction indicator and a dropdown for hide/pin.

**38. Bulk actions bar** — Floating bar appearing when rows are selected: count, action buttons, clear selection.

**39. `<DataTableToolbar>`** — Search input, faceted filters, view options, and export button — standard above every table.

**40. `<EmptyState>`** — Configurable empty UI with icon, title, description, and CTA. Variants for no-data vs. no-results.

**41. Server-side table fetcher** — Helper that takes table state, builds a Prisma query (`where`/`orderBy`/`skip`/`take`), returns rows + count.

**42. `<EditableCell>`** — Inline-edit table cells with optimistic save and escape-to-cancel.

**43. Column resize/reorder persistence** — Saves the user's column layout to localStorage/DB per table.

**44. `<DataGrid>` virtualized** — For 10k+ rows, virtual scrolling via TanStack Virtual.

**45. `<StatCard>`** — KPI card with value, label, trend arrow, sparkline, and loading skeleton.

**46. `<Timeline>`** — Vertical activity feed with timestamps, icons, and grouping by date.

---

## 5. Feedback & Overlays (47–58)

**47. `toast` system** — Pre-configured Sonner with success/error/loading/promise variants and consistent styling.

**48. `<ConfirmDialog>` + `useConfirm()`** — Imperative `await confirm({ title, description })` returning a boolean. No JSX boilerplate.

**49. `<Modal>` / `useModal()`** — Stack-aware modal manager, URL-driven open state, focus trap, escape handling.

**50. `<Drawer>`** — Side panel for detail views/forms, responsive (bottom sheet on mobile).

**51. `<CommandPalette>`** — Cmd+K global search/actions with fuzzy matching, recent items, and grouped results.

**52. `<LoadingButton>`** — Button with built-in spinner and disabled state during an async action.

**53. `<Skeleton>` library** — Matched skeletons for table rows, cards, forms, and detail pages.

**54. `<ErrorBoundary>` + fallback** — Catches render errors, shows recovery UI, reports to monitoring.

**55. Global loading bar** — Top progress bar (nprogress-style) on route transitions.

**56. `<Tooltip>` standardized** — Consistent delay, positioning, and keyboard support.

**57. `<CopyButton>`** — Click-to-copy with a "copied" feedback animation.

**58. `<Banner>` / announcement system** — Dismissible site-wide notices that persist dismissal.

---

## 6. File & Media (59–66)

**59. `uploadFile()`** — Unified upload to R2/UploadThing returning a URL, with progress callback and abort support.

**60. `<ImageUpload>`** — Client-side crop/resize before upload, preview, replace/remove.

**61. `<Avatar>` + fallback** — Image with initials fallback, status indicator, and group/stacked variant.

**62. `<FilePreview>`** — Renders images/PDFs/docs inline with a download fallback.

**63. Signed URL generator** — Server helper for time-limited R2 download links.

**64. `<Gallery>`** — Lightbox image viewer with keyboard nav, thumbnails, and zoom.

**65. CSV import wizard** — Upload → map columns → validate → preview → import, with error rows flagged.

**66. `<Dropzone>`** — Reusable drag-drop zone with hover state, multi-file support, and type restrictions.

---

## 7. Documents & Export (67–72)

**67. `<PDFDocument>` templates** — Base @react-pdf layout with header/footer/page numbers; invoice and report variants.

**68. `exportToExcel(data, config)`** — Takes rows + column config, generates styled xlsx, triggers download. Lazy-loaded.

**69. `exportToCSV()`** — Lightweight CSV export with proper escaping and custom headers.

**70. `generateInvoicePDF()`** — Branded invoice from order data: line items, totals, tax.

**71. Print stylesheet + `<PrintButton>`** — Print-optimized layout toggle for any page.

**72. Report builder** — Configurable data → PDF/Excel with charts and applied filters.

---

## 8. Notifications & Email (73–80)

**73. React Email templates** — Base layout plus welcome, reset-password, invoice, and notification templates with brand tokens.

**74. `sendEmail()`** — Typed Resend wrapper with template selection, dev preview mode, and queue/retry.

**75. In-app notification system** — Bell icon, unread count, dropdown list, mark-read, real-time via polling/SSE.

**76. `notify(userId, type, data)`** — Server helper creating both in-app and email notifications from one call, respecting user prefs.

**77. Notification preferences UI** — Per-channel (email/in-app) toggles per notification type.

**78. `<NotificationBell>`** — Dropdown with infinite scroll, grouping, and click-to-navigate.

**79. Email verification flow** — Send → verify token → confirmation, with a resend cooldown.

**80. Digest scheduler** — Batches notifications into daily/weekly email digests.

---

## 9. Payments & Billing (81–86)

**81. Stripe webhook handler** — Verified, typed event router with idempotency, handling the subscription lifecycle.

**82. `<PricingTable>`** — Plan cards from Stripe products with current-plan highlight and upgrade/downgrade.

**83. `<CheckoutButton>`** — Creates a session, redirects to Stripe Checkout, handles return.

**84. Billing portal link** — One-click to the Stripe customer portal for managing subscription/cards.

**85. `useSubscription()`** — Hook returning plan, status, limits, and `hasFeature(key)` for feature gating.

**86. Usage metering** — Track and enforce plan limits (seats, API calls) with a `<UsageBar>` display.

---

## 10. Layout & Navigation (87–92)

**87. `<AppShell>`** — Sidebar + topbar + content layout, responsive collapse, persisted state.

**88. `<Sidebar>` with active state** — Nav from config, nested groups, role-filtered items, badges.

**89. `<Breadcrumbs>`** — Auto-generated from route segments with custom label override.

**90. `<PageHeader>`** — Title, description, breadcrumbs, and an action-buttons slot — standard on every page.

**91. `<TabNav>`** — URL-synced tabs for detail page sections.

**92. Org/workspace switcher** — Dropdown to change the active tenant, persists selection, scopes all queries.

---

## 11. Utilities & Infra (93–100)

**93. `db` singleton** — Prisma client with connection pooling, dev query logging, soft-delete middleware.

**94. Multi-tenancy helper** — `tenantScope(orgId)` auto-injects an org filter into every Prisma query.

**95. Audit log system** — `audit(action, entity, changes)` recording who/what/when, with a viewer UI.

**96. `formatters`** — Centralized `formatCurrency`, `formatDate`, `formatRelativeTime`, `formatNumber` — locale/timezone aware.

**97. Rate limiter** — Upstash-backed `rateLimit(key, limit, window)` for routes, returning 429 with headers.

**98. Feature flags** — `useFlag('key')` + server `isEnabled()`, with an admin toggle UI and per-user/org targeting.

**99. Error/event monitoring wrapper** — Sentry init + `captureError()` with user context, plus a typed structured logger.

**100. Soft-delete + restore** — `deletedAt` pattern with a `<Trash>` UI to view/restore/permanently-delete records.

---

## 12. State, Hooks & DX (101–112)

**101. `useLocalStorage()` / `useSessionStorage()`** — SSR-safe storage hooks with typed values, cross-tab sync, and serialization handling.

**102. `useMediaQuery()`** — Reactive breakpoint hook with named presets (`isMobile`, `isTablet`, `isDesktop`).

**103. `cn()` class merger** — `clsx` + `tailwind-merge` wrapper for conflict-free conditional classes.

**104. `<ThemeProvider>` + `<ThemeToggle>`** — Light/dark/system with no flash on load (FOUC-safe), persisted choice.

**105. `useKeyboardShortcuts()`** — Global shortcut registry with scoping, a help dialog, and conflict detection.

**106. `useClipboard()`** — Copy/paste hook with success state and fallback for older browsers.

**107. `useDebounce()` / `useThrottle()`** — Generic value and callback debounce/throttle utilities.

**108. `usePrevious()` / `useIsMounted()`** — Small but constantly-needed lifecycle helpers.

**109. `useEventListener()`** — Typed, auto-cleanup window/element listener hook.

**110. `useIntersectionObserver()`** — Generic visibility hook for lazy-load, reveal animations, and infinite scroll.

**111. `<ClientOnly>` / `<NoSSR>`** — Defers rendering until mount to dodge hydration mismatches.

**112. `invariant()` / `assert()`** — Dev-time assertion helpers that strip in production builds.

---

## 13. Search, Filtering & Views (113–122)

**113. `<GlobalSearch>`** — Debounced multi-entity search with grouped results, keyboard nav, and recent searches.

**114. `useFilters()`** — URL-synced filter state manager with typed schema, defaults, and reset.

**115. `<FilterBar>`** — Composable faceted filters (select, date range, multi-select) with active-filter chips.

**116. Saved views** — Persist a named filter+sort+column combo per user, switchable from a dropdown.

**117. `<SearchInput>`** — Standardized search box with clear button, loading spinner, and keyboard hint.

**118. Faceted filter counts** — Shows result count per filter option, computed server-side.

**119. `buildPrismaWhere(filters)`** — Converts a typed filter object into a Prisma `where` clause safely.

**120. `<SortDropdown>`** — Reusable sort selector synced to URL with sensible defaults per entity.

**121. Recently viewed** — Tracks and surfaces a user's last-visited records across entities.

**122. Quick filters / segments** — One-click preset filters ("My open items", "Due today") defined per entity.

---

## 14. Realtime & Collaboration (123–130)

**123. SSE/WebSocket manager** — Single connection multiplexed across the app with auto-reconnect and backoff.

**124. `usePresence()`** — Shows who's currently viewing a record (avatars), backed by Redis presence keys.

**125. Live cursors / live updates** — Broadcast record changes so open clients update without refresh.

**126. `<TypingIndicator>`** — Reusable "user is typing…" for chat/comment threads.

**127. Optimistic comment thread** — `<Comments>` with mentions, edit/delete, and optimistic posting.

**128. `useChannel()`** — Subscribe/publish hook abstracting the transport (Pusher/Ably/self-hosted).

**129. Collaborative lock** — Prevents two users editing the same record; shows "locked by X" with takeover.

**130. Activity broadcast** — Server helper that emits an event on any mutation for realtime + audit in one call.

---

## 15. Dashboards & Charts (131–138)

**131. `<ChartCard>`** — Wrapper around Recharts/Visx with title, legend, loading skeleton, and empty state.

**132. `<LineChart>` / `<BarChart>` / `<AreaChart>`** — Pre-themed responsive chart primitives with tooltips and consistent palette.

**133. `<DonutChart>` / `<PieChart>`** — Proportion charts with center label and legend.

**134. `<Sparkline>`** — Tiny inline trend chart for stat cards and table cells.

**135. `<MetricGrid>`** — Responsive grid of KPI cards with comparison-vs-previous-period.

**136. `<DateRangePicker>` for dashboards** — Presets (7d/30d/QTD/YTD) plus custom range, drives all widgets.

**137. `<HeatmapCalendar>`** — GitHub-style contribution/activity calendar.

**138. `<FunnelChart>`** — Conversion funnel visualization for sales/onboarding pipelines.

---

## 16. Security, Compliance & Ops (139–150)

**139. CSRF + security headers** — Preconfigured middleware (CSP, HSTS, frame options) and CSRF protection for mutations.

**140. Input sanitizer** — `sanitizeHtml()` for any user-generated content rendered to the DOM.

**141. Idempotency middleware** — Idempotency-Key handling so retried/duplicate requests don't double-process.

**142. Webhook signature verifier** — Generic HMAC verification helper reused across Stripe, Resend, and custom webhooks.

**143. Data export (GDPR)** — One-click "export all my data" producing a downloadable archive per user.

**144. Account deletion flow** — Soft-delete → grace period → hard purge, with confirmation and audit trail.

**145. Health-check + readiness endpoints** — `/healthz` and `/readyz` checking DB/Redis/queue connectivity.

**146. Seed + factory system** — `seed.ts` with typed factories for realistic demo data per entity.

**147. Background job runner** — Typed queue (QStash/BullMQ) with `enqueue()`, retries, dead-letter, and a dashboard.

**148. Cron scheduler** — Declarative scheduled tasks (digests, cleanups, billing sync) with run history.

**149. Maintenance mode** — Flag-driven banner → full lockout page, with allowlist for admins.

**150. Environment validator** — Zod-validated `env.ts` that fails fast at boot if any required env var is missing or malformed.

---

## Implementation Priority (the highest-leverage 12)

If you build these first, you cover ~80% of every CRM/ERP's repeated work:

1. `<DataTable>` + `useTableState()` (#35, #36)
2. `<Form>` wrapper + shared Zod schemas (#23, #29)
3. `withCache` Redis layer + `invalidateCache` (#13, #14)
4. Stripe webhook handler (#81)
5. `requireAuth` / `requireRole` / `usePermissions` (#2, #3, #6)
6. Multi-tenancy `tenantScope` (#94)
7. `useOptimisticMutation` (#15)
8. `<AppShell>` + `<Sidebar>` (#87, #88)
9. `notify()` + React Email templates (#76, #73)
10. Audit log system (#95)
11. `env.ts` validator (#150)
12. Background job runner (#147)

---

*Generated as a starting blueprint. Each item is intentionally framework-agnostic in spirit but tuned to the Next.js 16 / Prisma / Upstash / Better Auth stack.*
