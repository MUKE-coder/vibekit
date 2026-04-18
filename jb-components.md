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
pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json
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

## Rules for Claude Code

1. **Always check this file before building auth, file upload, checkout, data table, blog, or API docs from scratch.**
2. **Install the component first.** Run the install command and read the installed files before writing any new code.
3. **Respect the install order.** Stripe UI needs Better Auth + Zustand Cart first. Don't skip prerequisites.
4. **Match environment variables exactly.** Copy the env var names from this file into `.env.local` and `.env.example`.
5. **Don't reinvent.** If a component exists, use it — do not write a parallel implementation.
