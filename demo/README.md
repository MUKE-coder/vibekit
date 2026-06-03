# VibeKit Demo — Smoke Test App

A Next.js 16 app that **installs and exercises every VibeKit primitive** so we can catch install-time / runtime breakage before users do.

> **Status:** scaffold + install plan. Pages not yet implemented. See [`PHASES.md`](./PHASES.md) for the work breakdown.

## Why this exists

The audit pass found 22 bugs that only show up at install time / first render. Going forward, every primitive change should pass through this app before we tag a release.

## Pages — what each one exercises

| Page | Route | Primitives exercised |
|---|---|---|
| **Dashboard home** | `/` | `app-shell`, `sidebar`, `breadcrumbs`, `page-header`, `stat-card`, `metric-grid`, `chart-card`, `line-chart`, `bar-chart`, `area-chart`, `sparkline`, `donut-chart`, `funnel-chart`, `heatmap-calendar`, `date-range-picker`, `theme-toggle`, `notification-bell`, `org-switcher`, `avatar`, `formatters` |
| **Customers list** | `/customers` | `use-table-state`, `column-header`, `data-table-toolbar`, `bulk-actions-bar`, `search-input`, `sort-dropdown`, `editable-cell`, `filter-bar`, `quick-filters`, `saved-views`, `facet-counts`, `recently-viewed`, `empty-state`, `skeletons`, `confirm-dialog`, `loading-button`, `copy-button`, `use-filters`, `use-debounced-query`, `use-paginated-query`, `server-table-fetcher`, `build-prisma-where`, `tooltip-standardized`, `toast-system` |
| **Big data grid** | `/customers/grid` | `data-grid` (50k rows), `use-column-preferences`, `use-infinite-scroll` |
| **Customer detail** | `/customers/[id]` | `tab-nav`, `field`, `form-combobox`, `form-date-picker`, `form-file-upload`, `form-autosave`, `use-unsaved-changes`, `use-async-validation`, `tag-input`, `zod-schemas`, `parse-form-data`, `image-upload`, `file-preview`, `signed-url`, `gallery`, `activity-timeline`, `audit-log` |
| **Bulk import** | `/customers/import` | `csv-import`, `dropzone`, `upload-file` |
| **Invoices** | `/invoices` | `export-to-csv`, `export-to-excel`, `print-button`, `invoice-pdf` (download route), `report-builder` (download route), `stripe-webhook-handler`, `billing-portal` |
| **Realtime room** | `/room/[id]` | `sse-channel`, `use-channel`, `use-presence`, `typing-indicator`, `collaborative-lock`, `live-cursors`, `comments-thread`, `activity-broadcast` |
| **⌘K palette** | global | `global-search`, `use-keyboard-shortcuts`, `command-palette` (legacy) |
| **Settings — profile** | `/settings/profile` | `field`, `form-combobox`, `form-date-picker`, all `zod-schemas`, `feature-flags` + `flags-provider` |
| **Settings — security** | `/settings/security` | `two-factor-setup`, `device-list`, `impersonation` (admin), `data-export`, `account-deletion` |
| **Settings — notifications** | `/settings/notifications` | `notification-preferences`, `digest-scheduler` (queue) |
| **Auth flows** | `/sign-in`, `/sign-up`, `/verify` | `auth-guard`, `role-gate`, `require-auth`, `require-role`, `use-current-user`, `use-permissions`, `use-session-refresh`, `email-verification`, `reset-password-email`, `invoice-email`, `react-email-templates`, `send-email` |
| **Maintenance** | `/_maintenance` | `maintenance-mode` |
| **API: healthz/readyz** | `/api/healthz`, `/api/readyz` | `health-endpoints`, `rate-limit`, `idempotency`, `webhook-verifier`, `security-headers`, `monitoring`, `env-validator`, `db`, `tenant-scope`, `audit-log`, `soft-delete`, `cache-redis`, `use-swr-cache`, `notify`, `background-jobs`, `seed-factory`, `input-sanitizer`, `api-client`, `query-keys`, `use-optimistic-mutation`, `use-polling`, `prefetch-on-hover` |
| **DX showcase** | `/devtools/hooks` | every `use-*` hook with a live demo card |
| **Layout demos** | `/devtools/layout` | `app-shell` variants, `drawer`, `modal`, `global-loading-bar`, `banner`, `error-boundary`, `client-only`, `invariant` |
| **Feature flags** | `/devtools/flags` | `feature-flags` + `flags-provider`, `use-mounted`, `use-toggle`, `use-async` |

That's all 144 GitHub-registry items + the 6 JB legacy graduations = **150/150 exercised**.

## Install plan

```bash
cd demo
pnpm install
# Then run the install script that calls shadcn add for every item:
pnpm vibekit:install-all
```

The install script will be `demo/scripts/install-all.ts`. See [`PHASES.md`](./PHASES.md) for the build order.

## Smoke test process

1. `pnpm install` succeeds.
2. `pnpm vibekit:install-all` adds every primitive without errors.
3. `pnpm tsc --noEmit` passes with zero errors.
4. `pnpm build` produces a successful Next.js build.
5. `pnpm dev` starts the app and every route in the table above renders without console errors.
6. Each page's interactive features work end-to-end (filter, sort, autosave, mention, live cursor sync between two tabs).

When all six pass on `main`, tag a release.

## Not in scope for the smoke test

- Visual polish — pages can be ugly, just functional.
- Real auth — Better Auth is mocked with a static user.
- Real Stripe — webhooks are mocked with the signature verifier.
- Real Upstash — uses a mock client when env vars are missing.

## Phased build

See [`PHASES.md`](./PHASES.md).
