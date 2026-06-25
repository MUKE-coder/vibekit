---
description: Pixel-perfect redesign of a section from a reference image (Dribbble, Mobbin, Figma export, screenshot). Replicates layout, typography, colors, components, and effects exactly as shown.
allowed-tools: [Read, Grep, Glob, Bash, Edit, Write]
---

# /redesign-from-image — Pixel-Perfect Reference Replication

The user has provided a reference image (Dribbble, Mobbin, competitor screenshot, Figma export, or sketch) and wants the section in that image rebuilt in their project **with pixel-perfect accuracy**.

This is NOT a "loose inspiration" task. The image is the spec. Every detail in the image must appear in the code.

## Step 1 — Confirm You Can See the Image

If no image is attached to the message, STOP and tell the user:
> "I don't see a reference image attached. Drag a Dribbble screenshot, Figma export, or PNG into the chat and re-run `/redesign-from-image`."

If an image IS attached, proceed.

## Step 2 — Describe the Image First (Before Writing Any Code)

Before writing a single line of JSX, write a **structured description** of the image. This forces accurate observation and gives the user a chance to correct misreadings cheaply.

Report in this format:

```
## What I see in the reference

**Section type:** <hero / pricing / dashboard card / sidebar nav / etc.>

**Layout:** <columns, rows, grid, alignment, breakpoints implied>

**Typography:**
- Heading: <font family guess, weight, approx px size, tracking, color>
- Body: <same>
- Supporting / labels: <same>

**Colors (extracted):**
- Background: <hex or rgb>
- Primary text: <hex>
- Accent / CTA: <hex>
- Borders: <hex>
- Decorative / chips / badges: <hex>

**Components visible:**
- <list each: button, card, input, badge, icon, image placeholder, divider, etc.>
- For each: shape, border-radius, shadow, hover hint (if any)

**Imagery & icons:**
- Icons: <icon style — Lucide outline / Heroicons solid / custom illustration / 3D render>
- Images: <aspect ratios, placeholder dimensions>

**Effects & details:**
- Shadows: <subtle / pronounced / inset>
- Border radius: <px value>
- Gradients / textures / overlays / noise / grain
- Hover / focus states implied
```

End with: `Looks right? (y / correct anything before I build)`

**WAIT for confirmation** before Step 3.

## Step 3 — Reconcile With Project Design Tokens

Before coding, check whether the image's colors / spacing / radius conflict with the project's design system:

1. Read `design-style-guide.md` (project root) for the locked palette, type scale, radius, and spacing.
2. **If the image's colors closely match project tokens** (within ~10% in HSL distance): use the project tokens, not raw extracted hex. This keeps the build consistent.
3. **If the image uses colors outside the project palette** (e.g. a Dribbble shot uses purple but the project is teal): ask the user:
   > "The reference uses {color}, but the project palette is {accent}. Should I (a) keep the reference color literally, (b) re-skin to the project accent, or (c) introduce {color} as a new secondary?"
4. **If `design-style-guide.md` is missing**, treat the image as the source of truth and extract colors literally.

## Step 4 — Check the Primitive Registry Before Building From Scratch

Before writing a button, input, card, badge, tab, modal, or any other UI element from scratch, grep `registry/INDEX.md` for a matching primitive:

```bash
grep -i "<keyword>" registry/INDEX.md
```

Also check `jb-components.md` for larger feature units (auth forms, file upload, data table, kanban).

For every primitive that matches the reference image, install it first:
```
pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>
```

Then style it to match the image. **Never reimplement what's already in the registry.**

## Step 5 — Build the Section With Pixel-Perfect Discipline

Now write the code. Follow these **strict, non-negotiable rules**:

### Layout & Structure
Replicate the exact layout, spacing, padding, margins, alignment, and positioning of every element. **Do not add, remove, or rearrange any section, block, or component.**

### Typography
Match the exact font sizes, font weights, line heights, letter spacing, and text hierarchy. **Preserve all text content exactly as shown in the image.** Do not paraphrase headlines, change copy, or "improve" wording.

### Colors
Use the exact colors for backgrounds, text, borders, icons, buttons, and any decorative elements. Extract colors precisely from the image (Step 2). When project tokens win the reconciliation in Step 3, map literal hex → token. Otherwise embed the literal hex.

### Patterns & Textures
Recreate any background patterns, gradients, overlays, noise textures, or decorative shapes exactly as they appear. Inline SVG for patterns, CSS gradients for gradients, low-opacity PNG for noise.

### Components & UI Elements
Replicate every button, card, icon, image placeholder, input, tag, badge, or divider with the exact same style, shape, size, and visual treatment. Reuse shadcn primitives wherever possible — restyle, don't reinvent.

### Imagery & Icons
Match icon styles, sizes, and placements. Use placeholder images that match the **exact dimensions and aspect ratios** shown — never substitute a square for a 16:9, never shrink a hero photo into a thumbnail. Use `next/image` with explicit `width` and `height` to prevent CLS.

### Effects & Details
Include any shadows, border radius, borders, hover states, focus rings, or other visual effects visible in the image. If the image hints at a hover state (e.g. a slight glow on one card), implement it.

### No Additions or Omissions
Do not add anything not visible in the image. Do not skip any detail, no matter how small. This includes: tiny indicators, small chips, divider lines, "1px" hairlines, faint background accents, status pips, subtle gradients behind icons.

## Step 6 — Self-Check Before Reporting Done

Before declaring the section finished, hold the running code next to the reference image and verify line by line:

- [ ] Every text string in the image appears in the code (verbatim)
- [ ] Every icon, badge, button, image, divider is present
- [ ] Layout matches at the breakpoint the image implies (usually desktop — also build a mobile fallback if not shown)
- [ ] Colors are within 1–2 hex points of the reference (or mapped to project tokens per Step 3)
- [ ] Border radius, shadow, gradient, and hover effects match
- [ ] No element was added that isn't in the image
- [ ] All `next/image` tags have explicit `width` / `height`
- [ ] Tabular-nums on any numerical data (prices, stats, dates)
- [ ] Hover + focus-visible states wired on every interactive element

## Step 7 — Report

Tell the user:
1. Which file(s) you created or edited
2. Which registry primitives you installed (with install commands)
3. Any tokens you mapped (image hex → project token)
4. Any items you flagged for user review (e.g. "the reference uses a font I can't identify — currently using `Inter`; swap if needed")

End with: `Reload http://localhost:3000/<route> to compare side-by-side with the reference.`

## When NOT to Use This Command

- The user wants a **rough adaptation** of the image (different layout, looser color match) — use a normal prompt instead, this command is for **exact replication**.
- The image is just a mood-board or palette inspiration — extract colors into `design-style-guide.md` directly, don't build a section.
- The image is a wireframe or sketch with no real visual design — ask the user to provide a higher-fidelity reference, or fall back to building from `design-style-guide.md`.

## Example

User attaches a Dribbble pricing-card screenshot and types `/redesign-from-image`.

Response:
> ## What I see in the reference
> **Section type:** 3-column pricing cards
> **Layout:** Equal-width grid, 32px gap, middle card raised 8px and outlined with accent
> **Typography:**
> - Heading (plan name): Inter 600, 20px, tracking-tight, slate-900
> - Price: Inter 700, 48px, tabular-nums, slate-900
> ...
> **Colors:**
> - Card bg: #FFFFFF
> - Border: #E2E8F0
> - Middle card border: #6366F1 (accent)
> ...
>
> Looks right? (y / correct anything before I build)

After user confirms, agent checks `design-style-guide.md`, finds the project accent is `#7C3AED` (close enough to `#6366F1` → maps to token), installs `pricing-card` primitive from the registry if it exists, builds the section, runs the self-check, reports.
