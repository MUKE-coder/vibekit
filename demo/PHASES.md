# VibeKit Demo — Build Phases

The smoke-test app is multi-session work. Each phase ends with a runnable, type-checked subset.

## Phase 0 — Scaffold (this session)

- [x] `demo/README.md` — page-to-primitive mapping
- [x] `demo/PHASES.md` — this file
- [ ] `pnpm create next-app demo --typescript --app --tailwind --no-src` — bare Next.js 16 + Tailwind v4 + App Router (no src folder — VibeKit rule)
- [ ] `pnpm dlx shadcn@latest init` to get `lib/utils.ts` + base ui primitives
- [ ] `demo/scripts/install-all.ts` — script that calls every `shadcn add MUKE-coder/vibekit/<name>` in dependency order
- [ ] `.env.example` listing every env var any primitive expects (UPSTASH_REDIS_REST_URL, DATABASE_URL, RESEND_API_KEY, etc.)

**Done when:** `pnpm dev` starts an empty Next.js app, `lib/utils.ts` exists with `cn()`.

## Phase 1 — Core install (1 session)

Install every primitive without wiring them up — pure import smoke test.

- [ ] Run `install-all.ts`. Note any install failures. Fix them in the parent registry.
- [ ] Add a Prisma schema sketching every model the primitives expect (`User`, `Notification`, `NotificationPreference` with `digestSentAt`/`digest`, `AuditLog`, `Invoice`, etc.).
- [ ] `pnpm prisma generate` to `lib/generated/prisma`.
- [ ] `pnpm tsc --noEmit` — fix every type error surfaced.

**Done when:** every primitive installs, `tsc` passes, `next build` succeeds with an empty home page.

## Phase 2 — Layout shell + Dashboard home (1 session)

- [ ] Wire `app-shell` + `sidebar` + `breadcrumbs` + `page-header` + `theme-toggle` + `org-switcher` + `notification-bell` + `avatar`.
- [ ] Dashboard home page renders: `stat-card` row → `metric-grid` → `chart-card` containing each of `line-chart` / `bar-chart` / `area-chart` / `donut-chart` / `funnel-chart` / `sparkline` / `heatmap-calendar`.
- [ ] `date-range-picker` drives the chart data (mock data, fine).

**Done when:** the home route renders the full dashboard, no console errors, theme toggle works.

## Phase 3 — Lists, tables, filtering (1 session)

- [ ] `/customers` route — full `use-table-state` + toolbar + filter-bar + saved-views + quick-filters + facet-counts.
- [ ] `/customers/grid` — `data-grid` with 50k mock rows + `use-column-preferences`.
- [ ] `recently-viewed` panel in sidebar.

**Done when:** filter + sort + paginate works, column resize persists, bulk select shows the bottom action bar, virtualized grid scrolls smoothly.

## Phase 4 — Forms, files, documents (1 session)

- [ ] `/customers/[id]` detail with `tab-nav`, all `field` variants, `form-autosave`, `tag-input`, `image-upload`.
- [ ] `/customers/import` CSV wizard.
- [ ] Invoice list page with `export-to-csv` / `-excel` / `print-button` / `invoice-pdf` download route / `report-builder` download route.

**Done when:** form autosaves, CSV import works end-to-end, downloads serve valid files.

## Phase 5 — Realtime + comments (1 session)

- [ ] `/room/[id]` — two-tab smoke test with `use-presence` showing both tabs, `typing-indicator` syncing, `live-cursors` syncing, `collaborative-lock` enforced, `comments-thread` with @mentions live-syncing.
- [ ] Server-side `activity-broadcast` writes an audit row + publishes to SSE.

**Done when:** open in two tabs, every realtime feature syncs without page reload.

## Phase 6 — Auth + Settings + Security (1 session)

- [ ] Mocked Better Auth flow: `/sign-in`, `/sign-up`, `/verify`, `/reset-password`.
- [ ] `/settings/profile`, `/settings/security` (`two-factor-setup`, `device-list`, `data-export`, `account-deletion` admin override).
- [ ] `/settings/notifications` → `notification-preferences`.
- [ ] Email previews at `/devtools/emails` — render every React Email template.

**Done when:** mocked sign-in flips `useCurrentUser`, every settings page works.

## Phase 7 — Infra + DX showcase (1 session)

- [ ] `/api/healthz`, `/api/readyz`.
- [ ] `/devtools/hooks` — live demo card for every `use-*` hook.
- [ ] `/devtools/layout` — drawer + modal + banner + global-loading-bar.
- [ ] `/devtools/flags` — feature-flags + flags-provider.
- [ ] CI workflow: `pnpm tsc --noEmit && pnpm build` runs on every PR.

**Done when:** every primitive in `registry/INDEX.md` is touched by at least one rendered page.

## Phase 8 — Hardening (1 session)

- [ ] Run the demo with real Upstash + real Neon + real Resend (dev keys). Catch env-loading bugs.
- [ ] Lighthouse / Web Vitals on `/`. Should be 90+ across the board.
- [ ] Add Playwright smoke tests for the 4 most-broken interaction patterns (filter persist, autosave, lightbox keyboard nav, ⌘K).

**Done when:** Playwright suite passes, Lighthouse green, the demo doubles as the public showcase site.

---

## How to use this for releases

After Phase 7, every primitive change must:

1. Land in `registry/<cat>/<file>.ts`.
2. Bump the demo where it's exercised (or add a new demo card if it's net-new).
3. Pass the CI smoke test.
4. Get reviewed for visible regressions on the affected demo page.

That closes the loop on "I wrote 144 files without installing one into a real project."
