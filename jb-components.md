# JB Component Registry — Reference Guide

> A decision guide for Claude Code. Before building any feature from scratch, check this file to see if a JB component already covers it. Using a JB component saves 60–80% of the tokens and produces battle-tested code.

**Registry base:** [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)
**Install pattern:** `pnpm dlx shadcn@latest add <registry-url>`

---

## How To Use This File

1. When planning a feature, search this file for a matching component.
2. If one exists — **install it first**, read the installed files, then build on top. Do NOT write from scratch.
3. Copy the exact install command. Use the exact environment variables listed.
4. Before installing, check **Prerequisites** — some components require others to be installed first (e.g. Stripe UI requires Better Auth + Zustand Cart).

---

## Quick Decision Matrix

| Need | Component | Install After |
|---|---|---|
| Marketing site / landing pages | Website UI | — |
| Authentication (sign-in, sign-up, OAuth) | JB Better Auth UI | — |
| File uploads (S3 / R2) | File Storage UI | Better Auth |
| Payment checkout (Stripe) | Stripe UI | Better Auth + Zustand Cart |
| Mobile Money + Card checkout (African markets) | DGateway Shop | — |
| Shopping cart (client-side) | Zustand Cart | — |
| Advanced data table | Data Table | — |
| Filterable dropdown with search | Searchable Select | — |
| Interactive API documentation | Scalar API Docs | — |
| Blog with MDX + syntax highlighting | MDX Blog | — |
| Drag-and-drop board (CRM, Kanban, hiring) | Kanban Board (in-house) | — |
| Rich text editing (notes, posts, messages) | Rich Text Editor (in-house) | — |
| Team / org management with invites + roles | Organization & Team UI (in-house) | — |
| Analytics dashboard with charts | Charts & Dashboard Grid (in-house) | — |
| Multi-step wizard / onboarding flow | Multi-Step Form (in-house) | — |
| ⌘K command palette | Command Palette (in-house) | — |
| Bell-dropdown notifications | Notification Center (in-house) | — |
| Tags input, phone input | Advanced Form Elements (in-house) | — |
| Media library / file browser UI | File Manager (in-house) | — |
| Invoice / receipt / report layouts | Printable Templates (in-house) | — |
| Product cards & ecommerce grid | Product Card & Grid (in-house) | — |
| Pricing tiers, plan comparison, billing history | SaaS Billing (in-house) | — |
| Subscription status + usage meters | SaaS Subscription (in-house) | — |
| API token management UI | SaaS Management (in-house) | — |
| Animated stat counter on scroll | Animated Counter (in-house) | — |
| Auto-scrolling logo / trusted-by strip | Logo Marquee (in-house) | — |
| Alternating-layout vertical timeline (about/roadmap) | Alternating Timeline (in-house) | — |
| Scroll-driven text reveal (manifesto hero) | Text Gradient Scroll (in-house) | — |
| Blurred gradient backdrop orb | Blurred Orb (in-house) | — |
| Designer-portfolio custom cursor | Custom Cursor (in-house) | — |
| **Form primitives** (FormField, FormControl, FormMessage etc.) — `shadcn add form` is gone | **Form (shadcn fallback)** (in-house) — install in Phase 1 | — |

---

## 1. Website UI Component

**What it is:** A complete Next.js marketing website scaffold with landing page, pricing, docs, and additional pages deployable in seconds.

**What it does:**
- 10 pre-built pages: home, pricing, docs, changelog, developers, help center, contact, hire-expert, 404
- Responsive navbar with dark mode toggle and language switcher (EN/FR)
- Built-in i18n via `next-intl` with full EN/FR translations
- SEO features: OpenGraph, Twitter cards, auto-generated `sitemap.xml` and `robots.txt`

**Files/pages it adds:**
- Routes: `/`, `/pricing`, `/docs`, `/docs/changelog`, `/developers`, `/help`, `/contact`, `/hire-expert`, `/404`
- Components: `navbar.tsx`, `footer.tsx`, `structured-data.tsx`
- Config: `config/site.ts`, `i18n/request.ts`, `en.json`, `fr.json`

**Environment variables:** None required

**When to use:** SaaS landing pages, startup websites, portfolios, product docs, agency templates, OSS homepages.

**When NOT to use:** Projects needing highly custom layouts from scratch or non-standard content structures.

**Install command:**
```bash
pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/website-ui.json
```

**Prerequisites:** Initialized Next.js project. Auto-installs `next-intl`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.

**Blog:** [jb.desishub.com/components/website-ui-component](https://jb.desishub.com/components/website-ui-component)

---

## 2. JB Better Auth UI Components

**What it is:** A production-ready authentication component library providing a complete sign-up, login, and password management flow with pre-built pages and database configuration.

**What it does:**
- 8 auth components: SignIn, SignUp, VerifyEmail, ForgetPassword, ResetPassword, ChangePassword, Profile, LogoutButton
- Pre-configured auth pages with OTP-based email verification and password reset
- Includes Prisma schema, validation schemas, and API route handlers
- OAuth integration with Google and GitHub
- Email templates and environment variable configuration

**Files/pages it adds:**
- Routes: `/auth/sign-in`, `/auth/sign-up`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password`, `/auth/profile`, `/dashboard`
- API: `/api/auth/[...all]/route.ts`
- Config: `.env.example`, Prisma schema, auth client configuration

**Environment variables:**
- `BETTER_AUTH_SECRET` — Random 32+ char string (generate at randomkeygen.com)
- `BETTER_AUTH_URL` — Full app URL (e.g. `http://localhost:3000` in dev, `https://yourdomain.com` in prod)
- `DATABASE_URL` — PostgreSQL connection string
- `RESEND_FROM_EMAIL` — Verified sender address (e.g. `noreply@yourdomain.com`)
- `RESEND_API_KEY` — From Resend dashboard
- `GOOGLE_CLIENT_ID` — From Google Cloud Console (optional)
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console (optional)
- `GITHUB_CLIENT_ID` — From GitHub OAuth apps (optional)
- `GITHUB_CLIENT_SECRET` — From GitHub OAuth apps (optional)

**When to use:** Every project that needs authentication. This is the default auth solution.

**When NOT to use:** Non-PostgreSQL databases, or projects needing custom auth logic outside this structure.

**Install command:**
```bash
pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json
```

**Prerequisites:** Next.js project with shadcn/ui initialized, PostgreSQL database (Neon/Supabase), Resend account.

**Blog:** [jb.desishub.com/components/jb-better-auth-ui-components](https://jb.desishub.com/components/jb-better-auth-ui-components)

---

## 3. File Storage UI

**What it is:** A complete file storage solution for Next.js supporting AWS S3 and Cloudflare R2 with drag-and-drop uploads and file management.

**What it does:**
- Multi-provider support for AWS S3 and Cloudflare R2
- Drag-and-drop uploads with 5 visual variants
- Real-time upload progress tracking via XHR
- File management (track, list, delete) with presigned URLs
- Full TypeScript support with Prisma DB integration

**Files/pages it adds:**
- Routes: `/categories`, `/file-storage`
- API: `/api/s3/upload`, `/api/s3/delete`, `/api/r2/upload`, `/api/r2/delete`, `/api/v1/categories/*`, `/api/v1/files`, `/api/v1/files/stats`
- Components: `Dropzone.tsx`, `ErrorDisplay.tsx`, category/file management components
- Schema: `File`, `StorageProvider`, `Category` Prisma models

**Environment variables:**
- `DATABASE_URL` — Database connection string
- **AWS S3 (if using):**
  - `AWS_S3_REGION`
  - `AWS_S3_BUCKET_NAME`
  - `AWS_S3_ACCESS_KEY_ID`
  - `AWS_S3_SECRET_ACCESS_KEY`
- **Cloudflare R2 (if using):**
  - `CLOUDFLARE_R2_ACCESS_KEY_ID`
  - `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
  - `CLOUDFLARE_R2_ENDPOINT`
  - `CLOUDFLARE_R2_BUCKET_NAME`
  - `CLOUDFLARE_R2_PUBLIC_DEV_URL`
- `NEXT_PUBLIC_API_URL` — API base URL

**When to use:** Apps requiring secure file uploads, multi-cloud storage flexibility, or file management dashboards. Default choice when user picks R2/S3 over UploadThing.

**When NOT to use:** Local-only storage, or if user chose UploadThing (use UploadThing SDK directly instead).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://file-storage.desishub.com/r/file-storage.json
```

**Prerequisites:** Next.js with shadcn/ui, Prisma ORM, AWS S3 or Cloudflare R2 bucket with credentials. Auto-installs `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `uuid`, `@tanstack/react-query`, `react-dropzone`, `react-hook-form`, `zod`.

**Blog:** [jb.desishub.com/components/file-storage-ui](https://jb.desishub.com/components/file-storage-ui)

---

## 4. Stripe UI Component

**What it is:** A production-ready e-commerce checkout solution for Next.js that integrates Stripe payments with product management and order tracking.

**What it does:**
- Embedded Stripe Payment Element with multi-method support and 3D Secure
- Complete checkout flow with order summary, shipping address, and payment processing
- Order management with history tracking and payment verification
- Server-side API routes for secure payment intent creation and product sync
- Responsive product grid with Zustand + localStorage cart integration

**Files/pages it adds:**
- Components: `stripe-provider.tsx`, `checkout-form.tsx`, `checkout-page.tsx`, `address-form.tsx`, `order-summary.tsx`, `order-confirmation.tsx`, `order-history.tsx`, `product-grid.tsx`
- Routes: `/products`, `/checkout`, `/order-confirmation`, `/dashboard/orders`, `/dashboard/orders/[id]`
- API: `/api/stripe/create-payment-intent`, `/api/stripe/verify-payment`
- Schema: `Category`, `Product`, `Order`, `OrderItem` Prisma models

**Environment variables:**
- `STRIPE_SECRET_KEY` — Server-side Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Client-side publishable key (starts with `pk_test_` or `pk_live_`)

**When to use:** E-commerce platforms, SaaS payment systems, digital product stores needing full checkout flows with Stripe.

**When NOT to use:** Simple donation systems, subscription-only products (use Stripe subscriptions directly), or markets requiring Mobile Money (use DGateway Shop instead).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://stripe-ui-component.desishub.com/r/stripe-ui-component.json
```

**Prerequisites:** shadcn/ui initialized, **JB Better Auth UI installed**, **Zustand Cart installed**, PostgreSQL database, Stripe API keys.

**Blog:** [jb.desishub.com/components/stripe-ui-component](https://jb.desishub.com/components/stripe-ui-component)

---

## 5. Data Table Component

**What it is:** An advanced data table with search, sorting, pagination, column visibility, and row selection built on TanStack React Table.

**What it does:**
- Search and filter table data
- Column sorting with directional indicators
- Pagination for large datasets
- Toggleable column visibility preferences
- Row selection functionality
- Pre-built column helpers: SortableColumn, DateColumn, ImageColumn, StatusColumn, ActionColumn

**Files/pages it adds:** Core table components + column helpers (exact files depend on shadcn install target).

**Environment variables:** None required.

**When to use:** Any page displaying lists of records (users, orders, products, invoices, contacts). This is the default table for dashboards.

**When NOT to use:** Simple static tables (<5 rows) or non-interactive data displays.

**Install command:**
```bash
pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json
```

**Prerequisites:** TanStack React Table library, shadcn/ui.

**Blog:** [jb.desishub.com/components/data-table-component](https://jb.desishub.com/components/data-table-component)

---

## 6. Scalar API Docs Component

**What it is:** Beautiful, interactive API docs for Next.js added in under 30 seconds with no manual setup.

**What it does:**
- 3 REST API endpoints (Products, Categories, Users) with GET all and GET by ID
- Full OpenAPI 3.0.3 specification with schemas, examples, and descriptions
- Deploys Scalar API Reference UI at `/api-docs` with modern theme
- Dummy data for immediate testing (6 products, 4 categories, 5 users)

**Files/pages it adds:**
- `app/api-docs/route.ts` (Scalar reference UI)
- `app/api/openapi/route.ts` (OpenAPI JSON)
- `app/api/products/route.ts` + `[id]/route.ts`
- `app/api/categories/route.ts` + `[id]/route.ts`
- `app/api/users/route.ts` + `[id]/route.ts`
- `data/openapi.ts`, `data/dummy.ts`

**Environment variables:** None required.

**When to use:** API prototyping, frontend dev with working endpoints, learning REST patterns, hackathons, client demos, documenting internal APIs.

**When NOT to use:** Projects with custom auth schemes or non-REST API patterns (GraphQL, tRPC).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/scalar-api-docs.json
```

**Prerequisites:** Initialized Next.js project. Auto-installs `@scalar/nextjs-api-reference` and `openapi-types`.

**Blog:** [jb.desishub.com/components/scalar-api-docs-component](https://jb.desishub.com/components/scalar-api-docs-component)

---

## 7. MDX Blog Component

**What it is:** A file-based blog system for Next.js featuring MDX rendering with syntax highlighting and SEO optimization.

**What it does:**
- `/blog` listing page and `/blog/[slug]` detail pages with prev/next navigation
- MDX content rendering with GitHub-quality syntax highlighting via rehype-pretty-code
- Copy-to-clipboard functionality on all code blocks
- Auto-generated SEO metadata (OpenGraph, Twitter cards, JSON-LD) per post
- Bundles 3 sample blog posts as reference material

**Files/pages it adds:**
- Routes: `/blog`, `/blog/[slug]`
- Components: `components/mdx.tsx`, `components/copy-button.tsx`, `components/post-item.tsx`
- Pages: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- Data: `data/blog.ts`, `types/blog.ts`
- Content: `content/blog/` (3 sample `.mdx` files)

**Environment variables:** None required.

**When to use:** Developer portfolios, product blogs, docs sites with code examples, teaching platforms, company content marketing.

**When NOT to use:** Projects needing comments, user-generated content, auth-gated content, or a full CMS dashboard.

**Install command:**
```bash
pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/mdx-blog.json
```

**Prerequisites:** Next.js with Tailwind CSS. Auto-installs `next-mdx-remote`, `gray-matter`, `shiki`, `rehype-pretty-code`, `remark-gfm`, `rehype-slug`, `rehype-external-links`.

**Blog:** [jb.desishub.com/components/mdx-blog-component](https://jb.desishub.com/components/mdx-blog-component)

---

## 8. DGateway Shop Component

**What it is:** A complete e-commerce solution for Next.js that enables product catalogs, shopping carts, and checkout with mobile money and card payment processing.

**What it does:**
- Product catalog interface at `/shop` with sample products
- Cart functionality with persistent localStorage
- Floating cart drawer with quantity adjustment
- Two payment methods: Mobile Money (DGateway/Iotec, UGX) and Stripe card payments (USD)
- Real-time payment status polling with success/failure screens

**Files/pages it adds:**
- Routes: `/shop`, `/checkout`
- API: `POST /api/checkout`, `POST /api/checkout/status`
- Components: `components/cart-drawer.tsx`
- Utilities: `lib/dgateway.ts`, `lib/cart-store.ts`
- Data: `data/shop-products.ts`

**Environment variables:**
- `DGATEWAY_API_URL` — DGateway API endpoint (e.g. `https://dgatewayapi.desispay.com`)
- `DGATEWAY_API_KEY` — API auth key from DGateway Dashboard

**When to use:** African market payments, multi-currency transactions (UGX + USD), marketplaces targeting mobile money users, SaaS for East African customers.

**When NOT to use:** Projects needing complex inventory, subscriptions, or Stripe-only markets (use Stripe UI instead).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/dgateway-shop.json
```

**Prerequisites:** Next.js App Router project. DGateway account with API credentials. Auto-installs `zustand`, `@stripe/react-stripe-js`, `@stripe/stripe-js`.

**Blog:** [jb.desishub.com/components/dgateway-shop-component](https://jb.desishub.com/components/dgateway-shop-component)

---

## 9. Searchable Select Component

**What it is:** A filterable select dropdown with search, clear button, and optional descriptions.

**What it does:**
- Searchable dropdown interface to filter through options
- Clear button to reset the selected value
- Optional description text for each option
- Type-to-search and filter available choices
- Handles value selection and change callbacks

**Files/pages it adds:** Single component file (location depends on shadcn install target).

**Environment variables:** None required.

**When to use:** Any select/dropdown with 10+ options, or where users benefit from type-to-filter (country pickers, tag selectors, product/user lookups).

**When NOT to use:** Simple 2–3 item selects (use regular shadcn Select), or multi-select scenarios (use MultiSelect).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://jb.desishub.com/r/searchable-select.json
```

**Prerequisites:** React, shadcn/ui configured.

**Blog:** [jb.desishub.com/components/searchable-select-component](https://jb.desishub.com/components/searchable-select-component)

---

## 10. Zustand Cart Component

**What it is:** A complete e-commerce shopping cart component with product listing and cart state management using Zustand.

**What it does:**
- Displays products in a responsive grid with images, descriptions, and pricing
- Shopping cart state with add/remove/quantity adjustment
- Floating cart panel showing items, totals, and checkout options
- Auto-persists cart to localStorage
- Individual reusable sub-components (ProductCard, ProductListing, Cart)

**Files/pages it adds:**
- `use-cart-store.ts` (Zustand store hook)
- `product-card.tsx`
- `product-listing.tsx`
- `cart.tsx`
- `zustand-cart.tsx` (main wrapper)
- `index.ts` (barrel export)

**Environment variables:** None required.

**When to use:** E-commerce sites needing client-side cart management with persistent storage. Install this **before Stripe UI** — it's a prerequisite.

**When NOT to use:** Server-side cart systems requiring real-time inventory sync, or when cart state must be shared across devices (use a database-backed cart).

**Install command:**
```bash
pnpm dlx shadcn@latest add https://jb.desishub.com/r/zustand-cart.json
```

**Prerequisites:** React/Next.js with Tailwind, shadcn/ui Button, `lucide-react`. Auto-installs `zustand`.

**Blog:** [jb.desishub.com/components/zustand-cart-component](https://jb.desishub.com/components/zustand-cart-component)

---

---

## VibeKit In-House Registry (vibekit.desishub.com)

> Components built and maintained as part of the VibeKit framework, hosted on the VibeKit landing site at `vibekit.desishub.com/r/{component}.json`.

These are **in-house VibeKit components** — built when no JB or community component covers the use case, or when the use case is so cross-cutting (Kanban, org UI, charts) that every app rebuilt from scratch would need it.

**Registry base:** `https://vibekit.desishub.com/r/{component}.json`
**Index:** `https://vibekit.desishub.com/r` (returns JSON array of all available components)
**Install pattern:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/{component}.json`
**Browse:** [vibekit.desishub.com/components](https://vibekit.desishub.com/components)

### Rules

1. **Check JB components first** — the JB registry above is the primary source. Only fall back to the in-house registry if no JB component exists for the need.
2. **Install order:** In-house components are self-contained unless noted. No cross-component install order requirements.
3. **File targets:** In-house components install to `components/{component-name}.tsx` by default.
4. **Design tokens:** In-house components use shadcn/ui primitives and respect Tailwind v4 `@theme` tokens from `design-style-guide.md`.

---

### 11. Kanban Board

**What it is:** Drag-and-drop board with column management, card creation, and swimlanes — built on dnd-kit.

**What it does:**
- Drag-and-drop cards between columns with keyboard accessibility
- Add, rename, and delete columns inline
- Create cards via dialog with title, description, label
- Drag overlay with rotation feedback

**Environment variables:** None.

**When to use:** CRM pipelines, project management, content calendars, hiring boards, lightweight task trackers.

**When NOT to use:** Linear-style nested tasks or Gantt timelines — use a dedicated PM library.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/kanban-board.json`

**Prerequisites:** shadcn/ui base (`button`, `card`, `badge`, `input`, `dialog`, `textarea`, `label`). Auto-installs `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`.

---

### 12. Rich Text Editor

**What it is:** Tiptap-powered rich text editor with formatting toolbar and controlled HTML output.

**What it does:**
- Formatting toolbar (bold, italic, headings, lists, code block, quote)
- Image and link extensions
- Placeholder text support
- Controlled HTML in/out — drop into React Hook Form

**Environment variables:** None.

**When to use:** Notes, blog editors, messaging composers, internal docs, knowledge bases.

**When NOT to use:** Markdown-only contexts (use MDX Blog) or real-time collaborative editors.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/rich-text-editor.json`

**Prerequisites:** shadcn/ui `button`, `toggle`, `separator`. Auto-installs `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`.

---

### 13. Organization & Team UI

**What it is:** Multi-tenant team UI with member directory, invites, role-based access, and org settings.

**What it does:**
- Member directory with avatars, names, roles, last-active
- Invite-by-email dialog with role selection (admin / member / viewer)
- Pending invites list with resend and revoke actions
- Organization settings panel (name, slug, logo)

**Environment variables:** None.

**When to use:** Multi-tenant SaaS, agency portals, team workspaces, any B2B app with RBAC + invites.

**When NOT to use:** Single-user apps or consumer products with no team concept.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/org-team-ui.json`

**Prerequisites:** shadcn/ui (`avatar`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `tabs`, `badge`).

---

### 14. Charts & Dashboard Grid

**What it is:** Responsive analytics dashboard with bar / line / pie / area charts on Recharts.

**What it does:**
- Bar, line, pie, area chart variants
- ChartCard wrapper with title, description, fullscreen toggle
- Responsive 1 → 2 → 4 column grid
- Skeleton + empty states baked in

**Environment variables:** None.

**When to use:** Analytics dashboards, reporting screens, KPI overviews, admin metrics.

**When NOT to use:** Single-chart pages — drop Recharts in directly.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/charts-grid.json`

**Prerequisites:** shadcn/ui (`card`, `tabs`, `skeleton`, `button`, `badge`). Auto-installs `recharts`.

---

### 15. Multi-Step Form / Wizard

**What it is:** Step-by-step form wizard with progress indicator, per-step validation, and back/continue controls.

**What it does:**
- Step progress indicator with numbered badges
- React Hook Form + Zod validation per step
- Back / Continue / Submit navigation
- Skippable and required steps

**Environment variables:** None.

**When to use:** Onboarding wizards, checkout flows, surveys, complex sign-up forms.

**When NOT to use:** Single-screen forms.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/multi-step-form.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `input`, `label`, `progress`, `select`, `textarea`, `badge`). Auto-installs `zod`, `react-hook-form`, `@hookform/resolvers`.

---

### 16. Command Palette

**What it is:** ⌘K-style command palette with keyboard shortcuts, fuzzy search, and grouped actions.

**What it does:**
- Global ⌘K / Ctrl-K trigger
- Fuzzy search across actions, routes, entities
- Grouped actions with icons and shortcut hints
- Built on cmdk + shadcn Dialog

**Environment variables:** None.

**When to use:** Dashboards with many routes, power-user apps, any tool where keyboard nav matters.

**When NOT to use:** Public marketing sites or apps with fewer than ~5 screens.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/command-palette.json`

**Prerequisites:** shadcn/ui `command`, `dialog`. Auto-installs `cmdk`.

---

### 17. Notification Center

**What it is:** Bell-dropdown notification center with read/unread state, tabs, and clear-all.

**What it does:**
- Bell icon with unread badge count
- All / Unread tabs
- Avatar + actor + timestamp per item
- Mark-as-read and clear-all actions

**Environment variables:** None.

**When to use:** Apps with in-product notifications, alerts, activity feeds, team mentions.

**When NOT to use:** Email-only notification flows.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/notification-center.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `dropdown-menu`, `scroll-area`, `tabs`, `avatar`, `badge`).

---

### 18. Advanced Form Elements

**What it is:** Tags input and phone input with formatting and validation.

**What it does:**
- Tags input — badges, Enter to add, Backspace to remove
- Phone input — country picker and live formatting
- Keyboard accessible with ARIA roles
- Drop-in inside React Hook Form

**Environment variables:** None.

**When to use:** Forms with tag selection, phone numbers, or chip-style inputs.

**When NOT to use:** Plain text fields — use shadcn Input.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/advanced-form-elements.json`

**Prerequisites:** shadcn/ui (`badge`, `button`, `input`, `label`, `popover`, `calendar`, `command`).

---

### 19. File Manager / Media Library

**What it is:** Media library with grid/list views, preview dialog, upload button, and search.

**What it does:**
- Grid + list view toggle
- File preview dialog with size, type, uploaded date
- Search across name and tags
- Upload button placeholder — wire to JB File Storage UI or UploadThing

**Environment variables:** None (storage env vars belong to the underlying upload component).

**When to use:** Asset management screens, CMS media tabs, dashboards where users browse and manage files.

**When NOT to use:** Single upload widgets — install JB File Storage UI directly.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/file-manager.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `dialog`, `input`, `badge`).

---

### 20. Printable Templates

**What it is:** Invoice, receipt, and report layouts with print-specific CSS and PDF export compatibility.

**What it does:**
- Invoice, receipt, and report layouts
- Print stylesheet (page break, header/footer)
- Pairs with `@react-pdf/renderer` for PDF export
- Customizable issuer / customer / items props

**Environment variables:** None.

**When to use:** Anywhere the app emits invoices, receipts, or printable reports.

**When NOT to use:** Interactive dashboards — these are layout-only.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/printable-templates.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `separator`, `table`).

---

### 21. Ecommerce UI Primitives

**What it is:** Rating stars, quantity selector, and price display with currency and discount support.

**What it does:**
- Rating component with keyboard navigation and ARIA radio-group semantics
- Quantity selector with connected minus/plus buttons, min/max bounds
- Price display with currency formatting, compare-at strikethrough, discount badge

**Environment variables:** None.

**When to use:** E-commerce product pages, catalog listings, cart interfaces needing reusable primitives.

**When NOT to use:** Static price labels or non-commerce contexts.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/ecommerce-ui.json`

**Prerequisites:** shadcn/ui (`button`, `badge`, `label`).

---

### 22. Product Card & Grid

**What it is:** Product card with image, price, rating, badge overlay, add-to-cart, plus a responsive grid with search and sort.

**What it does:**
- Product card with image hover zoom, badge overlays, and quick-add overlay
- Responsive grid (2 → 3 → 4 columns) with search and sort dropdown
- Skeleton loading and no-results empty state
- Mobile: always-visible add-to-cart button below the fold

**Environment variables:** None.

**When to use:** Product listing pages, catalogs, storefronts needing a polished browse experience.

**When NOT to use:** Text-only item lists, admin dashboards, non-ecommerce contexts.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/ecommerce-product.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `badge`, `input`, `skeleton`).

---

### 23. SaaS Subscription Status & Usage Meter

**What it is:** Current subscription plan card with status, renewal, upgrade actions, plus usage progress bars for API, storage, or seats.

**What it does:**
- Subscription plan card with status badge (active, past_due, canceled, trialing, incomplete)
- Renewal and trial-end dates with contextual messages
- Usage progress bars with automatic colour thresholds (75% amber, 90% red)
- Manage and Upgrade actions

**Environment variables:** None.

**When to use:** SaaS dashboard settings, account management, billing screens.

**When NOT to use:** Consumer apps without subscriptions or metered usage.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/saas-subscription.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `badge`, `progress`, `separator`).

---

### 24. SaaS Billing: Pricing, Comparison & History

**What it is:** Pricing tier cards, side-by-side plan comparison table, and billing/invoice history list.

**What it does:**
- Pricing tier cards with popular badge, feature check/x list, CTA
- Feature comparison table with category sections and sticky first column
- Billing history list with invoice status badges and PDF download
- Empty states for all sub-components

**Environment variables:** None.

**When to use:** SaaS landing pages (pricing section), account billing settings, admin portals.

**When NOT to use:** Single-plan flat-rate pricing or non-SaaS products.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/saas-billing.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `badge`, `separator`).

---

### 25. SaaS Management: API Tokens

**What it is:** API token manager with create dialog, scope selection, copy-to-clipboard, and revoke actions.

**What it does:**
- Token list with prefix display, copy-to-clipboard (2s feedback), revoke
- Create token dialog with scope selection (read/write per resource + admin)
- Newly-created token banner with one-time copy warning
- Empty state with guided CTA for first token

**Environment variables:** None.

**When to use:** SaaS developer portals, API management dashboards, account settings.

**When NOT to use:** Consumer apps without API access or token-based auth.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/saas-management.json`

**Prerequisites:** shadcn/ui (`button`, `card`, `dialog`, `input`, `label`, `badge`, `separator`).

---

### 26. Animated Counter

**What it is:** Number stat that counts up from 0 to a target value when scrolled into view.

**What it does:**
- Counts up only after `useInView` triggers (one-shot)
- Configurable `duration`, `prefix`, `suffix`
- Locale-formatted numbers (12,345 not 12345)
- Single `<span>` — drops into any layout

**Environment variables:** None.

**When to use:** Marketing stat bands, milestone numbers on About pages, dashboard reveals.

**When NOT to use:** Live numbers that change after first reveal — use state-driven content.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/animated-counter.json`

**Prerequisites:** Framer Motion (auto-installed).

---

### 27. Logo Marquee

**What it is:** Auto-scrolling brand strip with pause-on-hover and edge fade. CSS-only animation (no JS loop).

**What it does:**
- Seamless loop with duplicated logo list
- Direction (left / right) + configurable speed
- Pause on hover
- Edge mask fade for clean entry/exit
- Accepts img `src`, inline SVG, or plain text labels

**Environment variables:** None.

**When to use:** "Trusted by" social-proof strips, integrations sections, customer logo bands.

**When NOT to use:** Static grids where movement would distract.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/logo-marquee.json`

**Prerequisites:** None.

---

### 28. Alternating Timeline

**What it is:** Vertical timeline with left/right alternating entries and scroll-driven opacity/scale.

**What it does:**
- Auto-alternates left/right (override per entry with `layout`)
- Scroll-driven opacity + scale on each item
- Optional image, meta line (date/role), title, description
- Center timeline rail with dot markers (desktop)
- Stacked single-column on mobile

**Environment variables:** None.

**When to use:** About pages, company history, roadmaps, product evolution stories.

**When NOT to use:** Feed-style lists or comment threads.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/alternating-timeline.json`

**Prerequisites:** Framer Motion (auto-installed).

---

### 29. Text Gradient Scroll

**What it is:** Scroll-driven text reveal — paragraph fades word-by-word or letter-by-letter as the user scrolls past.

**What it does:**
- Word OR letter reveal granularity
- Baseline opacity modes: `none`, `soft`, `medium`
- Triggered by element's own scroll position
- Drop-in: `<TextGradientScroll text="..." />`

**Environment variables:** None.

**When to use:** Hero mission statements, manifesto sections, editorial brand pages.

**When NOT to use:** Critical product copy that must be readable from the first frame — accessibility risk on fast scrolls.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/text-gradient-scroll.json`

**Prerequisites:** Framer Motion (auto-installed).

---

### 30. Blurred Orb

**What it is:** Gradient-blurred backdrop element. Drop behind a hero or section for a soft glow accent — alternative to busy hero imagery.

**What it does:**
- Three token-driven variants: `primary`, `accent`, `muted`
- Configurable size via `className` (e.g. `h-[40rem] w-[40rem]`)
- Override gradient via `style` for custom radial-gradients
- `aria-hidden` + `pointer-events-none` — purely decorative

**Environment variables:** None.

**When to use:** Hero backdrops, behind feature cards, beside CTAs — anywhere a flat hero needs depth.

**When NOT to use:** Information-dense interfaces where the blur competes with content.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/blurred-orb.json`

**Prerequisites:** None.

---

### 31. Custom Cursor

**What it is:** Pointer-following animated cursor with dot + outline, hover-grow on links/buttons, click squeeze. Auto-hides on mobile.

**What it does:**
- Spring-physics follow (two layers: dot + outline ring)
- `mix-blend-difference` for visibility on any background
- Hover grow on `a`, `button`, `input`, `textarea`, or `[data-cursor-hover]` elements
- Click squeeze feedback
- Auto-hides on screens < 768px (no touch-device cursor)

**Environment variables:** None.

**When to use:** Designer portfolios, agency sites, brand sites where a tactile cursor reinforces aesthetic.

**When NOT to use:** App-style products, mobile-first audiences, accessibility-sensitive contexts.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/custom-cursor.json`

**Prerequisites:** Framer Motion (auto-installed).

---

## shadcn Fallback Primitives

> Components the framework depends on that are no longer in the upstream shadcn registry. Install these whenever `pnpm dlx shadcn@latest add <name>` returns "not found" or installs nothing.

### 32. Form (shadcn fallback)

**What it is:** The canonical shadcn Form primitives for React Hook Form. Provides `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, and the `useFormField()` hook — everything the FORM RULES in `master_prompt.md` reference.

**Why this exists separately:** Upstream shadcn removed `form` from the default registry. Every form pattern in the framework assumes these primitives at `components/ui/form.tsx`. Install this BEFORE writing any form.

**What it does:**
- `Form` = `FormProvider` from react-hook-form
- `FormField` wraps `Controller` with a context for ARIA wiring
- `FormItem` provides a unique id via `useId()` so labels / descriptions / messages can link
- `FormLabel` adds `data-error` styling and links `htmlFor` to the control
- `FormControl` is a `Slot` that gets `id`, `aria-describedby`, `aria-invalid`
- `FormDescription` and `FormMessage` are paragraphs with ids the control references

**Environment variables:** None.

**When to use:** Every project that needs forms. Install in Phase 1 alongside Better Auth UI so all subsequent forms work out of the box.

**When NOT to use:** Never skip — there's no upstream fallback. If you don't install this, every `<FormField>` / `<FormControl>` import will fail.

**Install:** `pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/form.json`

**Prerequisites:** shadcn `label` component. Auto-installs `react-hook-form`, `@radix-ui/react-label`, `@radix-ui/react-slot`.

**Files added:** `components/ui/form.tsx`

**Manual fallback (if the VibeKit registry is unreachable):** create `components/ui/form.tsx` with this exact source — it's the same canonical shadcn implementation, just hosted by VibeKit:

```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
)

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

## Rules for Coding Agents (Claude Code, Cursor, Cline, Codex, etc.)

1. **Always check this file before building auth, file uploads, checkout, data tables, blogs, API docs, Kanban boards, org/team UI, charts dashboards, multi-step forms, rich text editors, command palettes, notification centers, file managers, printable templates, ecommerce product grids, SaaS pricing/billing/subscription/token UIs, or hero sections from scratch.**
2. **Check JB components first, then in-house VibeKit components.** Both registries are documented above.
3. **Install the component first.** Run the install command and read the installed files before writing any new code.
4. **Respect the install order.** Stripe UI needs Better Auth + Zustand Cart first. Don't skip prerequisites.
5. **Match environment variables exactly.** Copy the env var names from this file into `.env.local` and `.env.example`.
6. **Don't reinvent.** If a component exists, use it — do not write a parallel implementation.
