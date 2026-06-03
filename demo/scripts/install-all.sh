#!/usr/bin/env bash
# Install every VibeKit primitive into the demo app. Run from `demo/`.
#
# Usage: pnpm vibekit:install-all   (wired in demo/package.json)
#
# Order matters: items with cross-registry deps install their deps via the
# registry resolver, but we still run categories in roughly dependency order
# so failures surface earlier. shadcn's `add` is idempotent — re-running is
# safe.

set -euo pipefail

# Helper: install one item with a clear status line so we see where it breaks.
add() {
  local name="$1"
  echo ""
  echo "▸ $name"
  pnpm dlx shadcn@latest add "MUKE-coder/vibekit/$name" --yes
}

# Shadcn primitives the registry items reference. Install these first so
# `lib/utils.ts` and base UI components exist before our primitives land.
echo "═══ shadcn base primitives ═══"
for p in avatar badge button calendar card command dialog dropdown-menu input \
         popover progress select separator skeleton switch table tabs textarea tooltip; do
  pnpm dlx shadcn@latest add "$p" --yes || true
done

# JB shadcn Form (upstream removed it)
pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json --yes || true

echo "═══ Utilities first (other items depend on db / monitoring) ═══"
for n in formatters env-validator client-only invariant monitoring db tenant-scope audit-log soft-delete rate-limit feature-flags; do
  add "$n"
done

echo "═══ Hooks ═══"
for n in use-local-storage use-media-query use-clipboard use-debounce use-throttle \
         use-event-listener use-intersection-observer use-previous use-keyboard-shortcuts \
         use-async use-mounted use-toggle; do
  add "$n"
done

echo "═══ Data fetching ═══"
for n in api-client query-keys cache-redis use-optimistic-mutation use-paginated-query \
         use-infinite-scroll use-debounced-query use-polling prefetch-on-hover use-swr-cache; do
  add "$n"
done

echo "═══ Auth ═══"
for n in use-current-user role-gate require-auth require-role auth-guard use-permissions \
         use-session-refresh two-factor-setup device-list impersonation; do
  add "$n"
done

echo "═══ Email ═══"
for n in send-email react-email-templates reset-password-email invoice-email; do
  add "$n"
done

echo "═══ Notifications ═══"
for n in notify notification-preferences email-verification digest-scheduler notification-bell; do
  add "$n"
done

echo "═══ Forms ═══"
for n in parse-form-data field form-combobox form-date-picker form-file-upload \
         use-unsaved-changes form-autosave use-async-validation zod-schemas tag-input; do
  add "$n"
done

echo "═══ Search ═══"
for n in search-input sort-dropdown build-prisma-where use-filters global-search \
         filter-bar recently-viewed saved-views quick-filters facet-counts; do
  add "$n"
done

echo "═══ Tables ═══"
for n in use-table-state stat-card column-header data-table-toolbar bulk-actions-bar \
         server-table-fetcher editable-cell activity-timeline use-column-preferences data-grid; do
  add "$n"
done

echo "═══ Feedback ═══"
for n in empty-state confirm-dialog loading-button copy-button toast-system modal drawer \
         skeletons error-boundary global-loading-bar tooltip-standardized banner; do
  add "$n"
done

echo "═══ File & Media ═══"
for n in upload-file image-upload file-preview signed-url gallery csv-import dropzone; do
  add "$n"
done

echo "═══ Documents ═══"
for n in export-to-csv export-to-excel print-button invoice-pdf report-builder; do
  add "$n"
done

echo "═══ Layout ═══"
for n in app-shell sidebar breadcrumbs page-header tab-nav avatar theme-toggle org-switcher; do
  add "$n"
done

echo "═══ Charts ═══"
for n in sparkline metric-grid date-range-picker donut-chart funnel-chart heatmap-calendar \
         chart-card line-chart bar-chart area-chart; do
  add "$n"
done

echo "═══ Realtime ═══"
for n in sse-channel use-presence use-channel typing-indicator collaborative-lock \
         activity-broadcast live-cursors comments-thread; do
  add "$n"
done

echo "═══ Payments ═══"
for n in stripe-webhook-handler billing-portal; do
  add "$n"
done

echo "═══ Security ═══"
for n in idempotency webhook-verifier health-endpoints seed-factory security-headers \
         input-sanitizer background-jobs maintenance-mode data-export account-deletion; do
  add "$n"
done

echo ""
echo "✓ All 144 GitHub-registry primitives installed."
echo "  Now run: pnpm tsc --noEmit && pnpm build"
