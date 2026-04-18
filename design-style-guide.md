# Invoice Pro — Design Style Guide

> Single source of truth for all visual and interaction decisions in Invoice Pro. Reference this file before writing any UI code.
>
> **Aesthetic**: Modern Minimal (Linear / Vercel school)
> **Scope**: Dashboard, Landing, Invoice PDF Templates, Email Templates

---

## 1. Design Philosophy

Invoice Pro is a premium B2B SaaS product for professionals who send invoices. The UI must feel **trustworthy, refined, and effortless** — the kind of tool you'd expect to pay for.

**Three core principles:**

1. **Premium minimalism** — Generous whitespace, sharp typography, subtle shadows. No decoration without purpose.
2. **Indigo as the hero** — One bold primary color on a warm neutral canvas. The indigo signals action, brand, and identity. Everything else stays quiet.
3. **Quiet confidence** — Refined borders, soft shadows, precise alignment. No gradients, no emoji in UI, no playful flourishes. It should feel like a tool, not a toy.

---

## 2. Typography

### Font Family

**Primary font: [Onest](https://fonts.google.com/specimen/Onest)** (Google Fonts)

Load via `next/font/google`:

```tsx
import { Onest } from "next/font/google";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});
```

Apply via `className={onest.variable}` on the root layout and reference it in Tailwind config as the default sans font.

**Why Onest**: modern geometric sans with excellent legibility at small sizes. Crisp numerals (critical for invoices and totals). Open-source, fast to load.

### Type Scale

| Style | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|-------------|----------|-------|
| `display` | 48px | 600 | 1.1 | -0.02em | Landing hero, marketing |
| `display-sm` | 36px | 600 | 1.15 | -0.02em | Section headers on landing |
| `h1` | 30px | 600 | 1.2 | -0.015em | Page titles in dashboard |
| `h2` | 24px | 600 | 1.25 | -0.01em | Section headings |
| `h3` | 20px | 600 | 1.3 | -0.005em | Card titles, modal titles |
| `h4` | 16px | 600 | 1.4 | 0 | List item titles, labels |
| `body-lg` | 16px | 400 | 1.55 | 0 | Marketing body copy |
| `body` | 14px | 400 | 1.5 | 0 | Default dashboard body text |
| `body-sm` | 13px | 400 | 1.5 | 0 | Secondary info, table data |
| `caption` | 12px | 500 | 1.4 | 0.01em | Meta, timestamps, badges |
| `micro` | 11px | 600 | 1.3 | 0.04em | Uppercase labels, eyebrows (uppercase) |
| `tabular` | 14px | 500 | 1.5 | 0 | Numbers, amounts — use `font-variant-numeric: tabular-nums` |
| `invoice-total` | 28px | 700 | 1.1 | -0.02em | Invoice total amount |

**Rules:**
- Headings use weight 600, never 700 or 800 in UI chrome (avoid aggressive).
- Marketing display headlines may use 600.
- **Always** use `tabular-nums` for money, quantities, and invoice numbers.
- Line-height: tighter (1.1–1.3) for display/headings, 1.5 for body.

---

## 3. Color Palette

### Primary (Indigo)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#EEF2FF` | Subtle backgrounds, focus rings, selected rows |
| `primary-100` | `#E0E7FF` | Hover surfaces, avatar bg, soft highlights |
| `primary-500` | `#6366F1` | Secondary action accents, links in body copy |
| `primary-600` | `#4F46E5` | **Primary brand** — buttons, active states, logo, primary CTA |
| `primary-700` | `#4338CA` | Button hover / pressed |
| `primary-900` | `#312E81` | Deep shadow text (rarely) |

### Neutrals (Warm Zinc)

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FAFAFA` | Page background |
| `neutral-100` | `#F4F4F5` | Card rails, table header bg, muted surfaces |
| `neutral-200` | `#E4E4E7` | Borders, dividers, input outlines |
| `neutral-300` | `#D4D4D8` | Placeholder text on light, disabled borders |
| `neutral-400` | `#A1A1AA` | Placeholder, meta text, secondary icons |
| `neutral-500` | `#71717A` | Secondary text, captions |
| `neutral-600` | `#52525B` | Body text secondary |
| `neutral-700` | `#3F3F46` | Body text primary (on white) |
| `neutral-900` | `#18181B` | Headings, primary text |
| `white` | `#FFFFFF` | Cards, modals, sidebar, nav |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `success-50` | `#ECFDF5` | Paid badge bg, success toast bg |
| `success-600` | `#059669` | Paid status, revenue-positive numbers, checkmarks |
| `warning-50` | `#FFFBEB` | Pending badge bg, due-soon alerts |
| `warning-600` | `#D97706` | Overdue warnings, quota warnings |
| `error-50` | `#FEF2F2` | Error toast bg, destructive confirm |
| `error-600` | `#DC2626` | Errors, destructive actions, quota exceeded |
| `info-50` | `#EFF6FF` | Info banner bg |
| `info-600` | `#2563EB` | Info text, neutral badges |

### Invoice Status Colors

| Status | Background | Text | Dot |
|--------|-----------|------|-----|
| Draft | `neutral-100` | `neutral-700` | `neutral-400` |
| Sent | `primary-50` | `primary-700` | `primary-600` |
| Viewed | `info-50` | `info-600` | `info-600` |
| Paid | `success-50` | `success-600` | `success-600` |
| Overdue | `error-50` | `error-600` | `error-600` |
| Cancelled | `neutral-100` | `neutral-500` | `neutral-400` |

**No gradients in app UI chrome.** The only acceptable gradient use:
- Marketing hero backgrounds (very subtle radial from `primary-50` → white)
- The Pro plan billing card (subtle indigo gradient for premium feel)

---

## 4. Spacing

**8px base grid.** All spacing = multiple of 4.

| Token | Value | Usage |
|-------|-------|-------|
| `space-0.5` | 2px | Icon internal spacing |
| `space-1` | 4px | Tight gaps (badge padding) |
| `space-2` | 8px | Between related inline elements |
| `space-3` | 12px | Input internal padding, card gaps |
| `space-4` | 16px | Standard gap between components |
| `space-5` | 20px | Card internal padding (small cards) |
| `space-6` | 24px | Card internal padding (default) |
| `space-8` | 32px | Between sections within a page |
| `space-10` | 40px | Section separators |
| `space-12` | 48px | Large section breaks |
| `space-16` | 64px | Marketing section padding |
| `space-24` | 96px | Landing hero vertical padding |

**Page-level spacing:**
- Dashboard content max-width: `1280px` with `px-8` on desktop, `px-4` on mobile
- Sidebar width: `256px` (expanded), `72px` (collapsed)
- Main content top padding: `24px` below header
- Section-to-section gap: `32px`
- Card internal padding: `24px` (default), `32px` (hero/primary cards)

**Density: Comfortable** — rows are `48px` tall, not `32px`. Breathable.

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Inputs, small chips, tag pills |
| `radius` | 8px | **Default** — buttons, badges, small cards |
| `radius-md` | 10px | Medium cards, modals content |
| `radius-lg` | 12px | Main dashboard cards, table containers |
| `radius-xl` | 16px | Modal outer shell, large feature cards |
| `radius-2xl` | 20px | Hero marketing cards only |
| `radius-full` | 9999px | Avatars, status dots, icon pills |

**Rule**: Never mix radius values in the same container. A card with `radius-lg` should contain children with `radius` or smaller, never larger.

---

## 6. Shadows & Elevation

```
shadow-xs:    0 1px 2px 0 rgba(24, 24, 27, 0.05)
shadow-sm:    0 1px 3px 0 rgba(24, 24, 27, 0.08), 0 1px 2px -1px rgba(24, 24, 27, 0.04)
shadow-md:    0 4px 6px -1px rgba(24, 24, 27, 0.08), 0 2px 4px -2px rgba(24, 24, 27, 0.04)
shadow-lg:    0 10px 15px -3px rgba(24, 24, 27, 0.08), 0 4px 6px -4px rgba(24, 24, 27, 0.04)
shadow-xl:    0 20px 25px -5px rgba(24, 24, 27, 0.10), 0 8px 10px -6px rgba(24, 24, 27, 0.04)

shadow-focus: 0 0 0 3px rgba(79, 70, 229, 0.15)  // Focus rings only
```

**Usage:**
- Cards on page: `shadow-xs` + `border border-neutral-200`
- Hover on interactive cards: `shadow-sm`
- Dropdowns & popovers: `shadow-md` + `border border-neutral-200`
- Modals: `shadow-xl`
- Focus rings: `shadow-focus` instead of outline
- **Inputs have NO shadow** — use border only

**Philosophy**: Borders do most of the work. Shadows are subtle — a hint of depth, not a cloud.

---

## 7. Component Specifications

### 7.1 Buttons

**Primary Button**
- Background: `primary-600` (`#4F46E5`)
- Text: White, `14px` weight 500
- Height: `40px` (default), `36px` (sm), `44px` (lg)
- Horizontal padding: `16px`
- Border radius: `radius` (8px)
- Hover: `primary-700`
- Active: `primary-700` + scale(0.98)
- Focus: `shadow-focus` ring
- Disabled: `neutral-200` bg, `neutral-400` text
- Loading: spinner replaces icon, text stays

**Secondary Button (Outline)**
- Background: White
- Border: `1px solid neutral-200`
- Text: `neutral-900`, 14px weight 500
- Hover: `neutral-50` bg, `neutral-300` border

**Ghost Button**
- Background: Transparent
- Text: `neutral-700`, 14px weight 500
- Hover: `neutral-100` bg

**Destructive Button**
- Background: `error-600`
- Text: White
- Hover: `#B91C1C`
- Use only for delete/cancel actions

**Text Link**
- Color: `primary-600`
- Hover: `primary-700`, underline
- Inline: underlined, `underline-offset-4`, `decoration-neutral-300`

**Icon Button**
- Size: `36×36px` (default), `32×32px` (sm)
- Background: Transparent (ghost) or White + border
- Icon: `18px`, `neutral-600`
- Radius: `radius` (8px)
- Hover: `neutral-100`

---

### 7.2 Inputs

- Height: `40px`
- Background: White
- Border: `1px solid neutral-200`
- Radius: `radius-sm` (6px)
- Padding: `12px` horizontal
- Text: `14px`, `neutral-900`
- Placeholder: `neutral-400`
- Focus: `primary-600` border + `shadow-focus` ring, **no outline**
- Disabled: `neutral-50` bg, `neutral-400` text
- Invalid: `error-600` border, error text below (`13px`, `error-600`)
- Label above: `13px` weight 500, `neutral-700`, `8px` gap to input
- Helper text below: `12px`, `neutral-500`

**Textarea**: same as input, min-height `96px`, `vertical` resize only.

**Select**: same as input + chevron icon right. On open, menu uses `shadow-md` + `border neutral-200`.

**Search Input (global search)**
- Background: `neutral-50`
- Border: `1px solid neutral-200`
- Icon: search, `neutral-400`, left `12px`
- Height: `38px`
- On focus: border → `primary-600`, bg → white

---

### 7.3 Cards

**Default Card**
- Background: White
- Border: `1px solid neutral-200`
- Radius: `radius-lg` (12px)
- Shadow: `shadow-xs`
- Padding: `24px`
- Hover (if interactive): `shadow-sm` + `border-neutral-300`

**Metric Card (dashboard KPI)**
- Label: `caption` uppercase `neutral-500` tracking-wider
- Value: `28px` weight 600 `neutral-900`, `tabular-nums`
- Delta: `13px` weight 500, `success-600` (up) or `error-600` (down)
- Icon: top-right, `20px`, `neutral-400`

**Feature Card (landing)**
- Padding: `32px`
- Icon: `40px`, `primary-600` in a `primary-50` square (`radius`)
- Title: `h3`
- Description: `body` `neutral-600`

**Pricing Card**
- Border: `1px solid neutral-200`
- Radius: `radius-xl` (16px)
- Padding: `32px`
- Featured (Pro): `2px solid primary-600`, subtle `primary-50` gradient top
- Price: `48px` weight 700 `neutral-900`
- `/month`: `16px` weight 400 `neutral-500`

---

### 7.4 Tables

- Header row: `bg-neutral-50`, `13px` weight 600 `neutral-600` uppercase tracking-wider, `48px` tall
- Body row: `56px` tall (comfortable), `14px` `neutral-700`
- Border bottom between rows: `1px solid neutral-100`
- Hover row: `bg-neutral-50`
- Selected row: `bg-primary-50`
- First column padding: `24px` left
- Last column padding: `24px` right
- Sort indicators: `neutral-400` chevron, `primary-600` when active
- Sticky header when scrolling
- Zebra striping: **off** — rely on dividers only (cleaner)

**Row actions (kebab menu)**: icon button on hover reveal, dropdown right-aligned.

---

### 7.5 Status Badges

- Height: `24px`
- Padding: `4px 10px`
- Radius: `radius-full`
- Font: `12px` weight 500
- Dot: `6px` circle, `6px` right margin, flex-inline
- Background + text: see §3 Invoice Status Colors

**Example** — Paid:
```
bg-success-50 text-success-600 border border-success-600/10
● Paid
```

---

### 7.6 Sidebar (Dashboard Navigation)

- Width: `256px`
- Background: White
- Border right: `1px solid neutral-200`
- Padding: `16px`
- Logo block: `64px` tall, bottom border `neutral-100`
- Nav section label: `micro` uppercase `neutral-400`, `12px` bottom margin
- Nav item:
  - Height: `40px`
  - Padding: `10px 12px`
  - Radius: `radius`
  - Icon: `18px` `neutral-500`
  - Text: `14px` weight 500 `neutral-700`
  - Gap icon ↔ text: `12px`
  - Hover: `bg-neutral-100`
  - Active: `bg-primary-50`, `text-primary-700`, icon `primary-600`, optional `2px` left accent bar
- User block at bottom: avatar `36×36` + name `14px` + email `12px neutral-500`

---

### 7.7 Top Bar / Page Header

- Height: `64px`
- Background: White
- Border bottom: `1px solid neutral-100`
- Padding: `0 32px`
- Left: breadcrumbs or page title (`h1`)
- Right: search + notifications bell + avatar
- Sticky on scroll

---

### 7.8 Modals & Dialogs

- Overlay: `rgba(24, 24, 27, 0.5)` + `backdrop-blur-sm`
- Modal: max-width `512px` (default), `640px` (lg)
- Background: White
- Radius: `radius-xl` (16px)
- Shadow: `shadow-xl`
- Header padding: `24px 24px 16px`
- Body padding: `16px 24px`
- Footer padding: `16px 24px 24px`, right-aligned buttons with `12px` gap
- Title: `h3`
- Description: `body-sm` `neutral-500`
- Close button: icon top-right `16px`
- Open animation: scale(0.96) + opacity → scale(1) + opacity, `200ms` ease-out

---

### 7.9 Toasts / Notifications

Using Sonner:
- Bottom-right position
- White bg, `shadow-lg`, `border border-neutral-200`
- Radius: `radius` (8px)
- Padding: `14px 16px`
- Icon left: `18px`, color by type
- Title: `14px` weight 500 `neutral-900`
- Description: `13px` `neutral-500`
- Auto-dismiss: `4s`
- Success: checkmark `success-600`
- Error: x-circle `error-600`
- Warning: triangle `warning-600`
- Info: info-circle `primary-600`

---

### 7.10 Empty States

- Vertically centered in container
- Icon: `48px`, `neutral-300` inside a `72×72` `neutral-100` circle
- Title: `h3` `neutral-900`
- Description: `body` `neutral-500`, max-width `400px`, centered
- Primary CTA button below, `32px` top margin

---

### 7.11 Forms

- Field vertical gap: `20px`
- Field group label: `13px` weight 500 `neutral-700`
- Field group helper text: `12px` `neutral-500`, below input
- Section group divider: `border-t neutral-200`, `32px` top margin
- Section group header: `h4` `neutral-900`, followed by `body-sm neutral-500`
- Form footer: sticky bottom or inline, right-aligned Cancel (ghost) + Save (primary)

**Validation (React Hook Form + Zod):**
- Inline errors below field: `12px` weight 500 `error-600`
- Border on invalid: `error-600`
- Disable submit button during `isSubmitting`, show spinner inside button

---

## 8. Iconography

Use **[Lucide Icons](https://lucide.dev)** (`lucide-react`) as the primary icon library.

**Sizing:**
- Nav icons: `18px`
- Inline with body text: `14px`
- Icon buttons: `18px`
- Card feature icons: `20–24px`
- Empty state icons: `48px`
- Marketing feature icons: `28–40px`

**Color rules:**
- Default neutral icons: `neutral-500`
- Active/selected icons: `primary-600`
- Icon inside a primary CTA button: `white`
- Feature highlight icons: `primary-600` on `primary-50` square bg

**Stroke width:** `2` (default). Do not mix strokes.

---

## 9. Motion & Animation

**Principles:** fast, subtle, never bouncy.

| Transition | Duration | Easing |
|-----------|----------|--------|
| Button press | `100ms` | `ease-out` |
| Hover state | `150ms` | `ease-out` |
| Dropdown/popover | `150ms` | `ease-out` |
| Modal enter | `200ms` | `ease-out` |
| Modal exit | `150ms` | `ease-in` |
| Page transition | `300ms` | `ease-out` |
| Toast slide | `250ms` | `cubic-bezier(0.16, 1, 0.3, 1)` |

**Do:**
- `transition-colors` on all interactive elements
- Fade + scale for modals (`scale(0.96) → scale(1)`)
- Skeleton shimmer for loading cards

**Don't:**
- Spring animations
- Rotation / flips
- Anything > 400ms
- Blinking, pulsing (except loading spinners)

---

## 10. Imagery

- **Product screenshots on landing**: Real dashboard screens inside a browser frame (Mac-style chrome), subtle shadow, slight tilt optional
- **Avatars**: Circular, `neutral-100` placeholder bg with initials in `neutral-600`
- **Empty states**: Simple Lucide icon, no illustrations
- **Logos (brand)**: max `150×52.5px` in PDF, `h-12` in email header, `h-10` in dashboard topbar
- **Hero illustrations**: Prefer abstract product mockups or a single marquee dashboard screenshot over cartoons

---

## 11. Landing Page Specifics

- Hero background: `neutral-50` with a very subtle radial `primary-50 → transparent` centered
- Hero headline: `display` (48px) `neutral-900`, max 2 lines
- Hero subhead: `body-lg` (16px) `neutral-600`, max 640px width
- Hero CTA cluster: primary button + ghost "See pricing" link, `24px` gap
- Section alternation: white → `neutral-50` → white, `96px` vertical padding each
- Max content width: `1200px`
- Feature grid: 3 columns desktop, 1 column mobile, `32px` gap
- Testimonial card: bigger radius (`radius-xl`), 1 border, `32px` padding
- Pricing cards: see §7.3

---

## 12. Invoice PDF Templates

PDFs use `@react-pdf/renderer` with its own `StyleSheet`. Keep PDF styling **closely aligned** with dashboard tokens but adapted for print:

**PDF palette:**
- Text primary: `#18181B`
- Text secondary: `#52525B`
- Muted: `#A1A1AA`
- Borders: `#E4E4E7`
- Brand accent: user's custom `brandColor` from Brand settings (fallback `#4F46E5`)

**PDF typography:**
- Header/total: 24px weight 700
- Section headings: 13px weight 700 uppercase, `letterSpacing: 0.5`
- Body: 10px weight 400
- Table: 10px, `tabular-nums`

**PDF spacing:**
- Page padding: `40px`
- Section gap: `24px`
- Header height: `80px`

**PDF templates** remain visually distinct (Professional, Modern, Classic, Minimal) but **all share** the typography scale, neutral palette, and spacing rhythm above.

---

## 13. Email Templates (React Email)

- Max width: `600px`
- Background: `#F4F4F5` (neutral-100)
- Card: white, `border: 1px solid #E4E4E7`, `radius: 12px`
- Header: uses brand color if set, else `#4F46E5`
- Body padding: `24px`
- Typography: system font stack (Onest doesn't render in email clients) — `font-family: 'Onest', -apple-system, 'Segoe UI', Roboto, sans-serif` with fallbacks
- Buttons: solid `primary-600`, white text, `12px 24px` padding, `radius: 8px`, `font-size: 14px`, `weight: 500`
- Footer: `caption` size, `neutral-500` color, centered
- **Currency**: always use the brand's currency symbol via `data.currency`, never hardcode `$`

---

## 14. Tailwind Configuration

Extend `tailwind.config.ts`:

```ts
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-onest)", "system-ui", "sans-serif"],
    },
    colors: {
      primary: {
        50: "#EEF2FF",
        100: "#E0E7FF",
        500: "#6366F1",
        600: "#4F46E5",
        700: "#4338CA",
        900: "#312E81",
      },
      // zinc is already in Tailwind — alias as neutral if needed
    },
    boxShadow: {
      xs: "0 1px 2px 0 rgba(24, 24, 27, 0.05)",
      focus: "0 0 0 3px rgba(79, 70, 229, 0.15)",
    },
    borderRadius: {
      DEFAULT: "0.5rem", // 8px
    },
    fontVariantNumeric: {
      tabular: "tabular-nums",
    },
  },
}
```

For neutrals, use Tailwind's built-in `zinc` scale directly (`text-zinc-700`, `bg-zinc-50`) — it matches exactly.

---

## 15. Accessibility

- Minimum touch target: `40×40px` (desktop), `44×44px` (mobile)
- Color contrast: `4.5:1` for body text, `3:1` for large text and UI components
- Focus rings: visible on all interactive elements (`shadow-focus`), never removed
- Icons used alone: include `aria-label` or `sr-only` text
- Form fields: always have a `<label>` linked via `htmlFor`
- Status badges: don't rely on color alone — include text + dot
- Semantic HTML: use `<button>` for actions, `<a>` for navigation

---

## 16. Do's & Don'ts

**Do:**
- Use `tabular-nums` for all money
- Use the zinc scale for neutrals, indigo for action
- Rely on borders + subtle shadows for hierarchy
- Keep generous whitespace
- Use Lucide icons consistently at standard sizes
- Reuse shadcn/ui components where possible and restyle via tokens

**Don't:**
- Use emoji in UI chrome
- Use drop shadows heavier than `shadow-md` in-app
- Use gradients outside of marketing hero / Pro pricing card
- Mix border radius within a single container
- Use bright/saturated colors outside the semantic tokens
- Hardcode `$` — always reference brand currency
- Use font weights above 600 in app chrome (700 reserved for invoice totals and marketing display)
- Write custom CSS when a utility class exists
