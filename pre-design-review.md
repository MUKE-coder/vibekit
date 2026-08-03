# VibeKit — Pre-Design Review Prompt

> **When to use:** Run this in your AI agent after a UI is built (or before a public release) to audit the app's **design** — not its code correctness. It is the visual/UX counterpart to [`pre-deploy-review.md`](./pre-deploy-review.md): that one checks performance and security; this one checks whether the app actually looks and feels designed.

> **How to use:** Open your agent in the project root and paste the prompt below. It compares the app against your own `design-style-guide.md` **and** a set of universal design principles, writes a Critical / High / Medium report, and then fixes what you approve.

> **Best with Playwright MCP.** `npx vibekit-framework init` registers it. With a browser, the agent evaluates the *rendered* pages — real contrast, spacing, hierarchy, and interaction states — instead of guessing from source. Without it, the agent reviews the code and asks you for screenshots.

---

## The Prompt — copy everything below

```
I need you to perform a senior product-designer review of my app's UI/UX. This is a
DESIGN review, not a code-correctness review. Judge what the user actually sees and
feels: hierarchy, spacing, type, color, consistency, states, accessibility, and whether
the result looks deliberately designed rather than AI-default.

## HOW TO LOOK AT THE APP (do this first)

1. Read `design-style-guide.md` in the project root. This is the SOURCE OF TRUTH for
   this app's design system — its palette, type scale, spacing scale, radii, shadows,
   and per-component specs. Most of my review is: "does the built UI match this file?"
   If the file is missing, say so and review against the universal principles alone.
2. Read `project-description.md` for what the app is, who it's for, and the intended
   tone. A children's learning app and a compliance dashboard should NOT feel the same.
3. Start the app (`pnpm dev`) and, if you have the Playwright MCP browser, OPEN each key
   page. Take an accessibility snapshot and a screenshot of each. Actually exercise
   states: hover buttons, focus inputs, submit an empty form, load a list while empty.
   Judge the RENDERED result, not just the JSX. If you have no browser, review the code
   and ask me to paste screenshots of the main pages.
4. Review at BOTH desktop (1280px) and mobile (375px). Many defects only appear at one.

Cover every distinct screen: landing/marketing, auth, the main dashboard/list, a
detail/form page, an empty state, and one error state.

## THE CHECKLIST — audit against every category

### A. Design-system fidelity (compare the app to `design-style-guide.md`)
This is the core check. Flag every deviation from the guide:
- Colors used that are NOT in the defined palette (eyeball hex values / arbitrary Tailwind
  colors like `bg-blue-500` instead of the token `bg-[color:var(--accent)]`).
- Type sizes/weights that don't match the type scale.
- Spacing that breaks the scale (random `p-[13px]`, `gap-[7px]` instead of the 4/8px rhythm).
- Border-radius / shadow values that aren't from the defined scales.
- Components (buttons, inputs, cards, tables, badges, modals) that don't match their spec
  in §7 of the guide.
- Icons from a second icon library, or emoji used as UI icons.

### B. Visual hierarchy & focal point
- Each screen has ONE clear focal point; the eye lands where intended.
- The primary action is the most prominent element on the page (size, weight, color).
- Emphasis is planned — nothing competes with the CTA; secondary actions are visibly secondary.
- Headings, body, and captions are clearly differentiated in size/weight.

### C. Layout, alignment & grid
- Elements align to a consistent grid; edges line up (text blocks to image borders, etc.).
- Consistent page margins and gutters; no arbitrary one-off offsets.
- Related items are grouped by proximity; unrelated items are separated (Gestalt).

### D. White space & density
- Enough breathing room — the UI isn't cluttered and cramped.
- Not SO sparse that relationships are lost or the page feels empty.
- Padding rhythm is consistent between similar components.

### E. Typography
- At most two font families (VibeKit default: one sans + one mono). A third is slop.
- Body weight 400, headings 600 — never 800/900. Display tracking tightened (-0.02 to -0.04em).
- Heading levels are SEMANTIC and in order (one h1 per page, no skipping h2→h4 for size).
- Body line length is readable (~45–75 characters); line-height comfortable (1.5-ish body).
- No orphaned/ad-hoc text styles that exist nowhere in the type scale.

### F. Color & contrast
- ONE accent color per project, used consistently for primary actions.
- WCAG AA contrast: ≥4.5:1 for body text, ≥3:1 for large text and UI/icon boundaries.
  Flag any low-contrast text (light gray on white, dark text on a dark surface).
- Semantic colors used correctly (red = error/destructive, green = success, etc.).
- NO multi-color "AI slop" gradients (purple→pink→orange), and no gradient on
  `background-clip: text` unless the style guide explicitly calls for it.
- Color is never the ONLY signal (error states also have an icon/text, not just red).

### G. Consistency & standards
- The same component looks and behaves the same on every page.
- Buttons, inputs, cards, and spacing are uniform across screens.
- Labels and terminology are consistent (don't call it "Clients" on one page, "Customers" on another).
- Matches platform conventions where users expect them (a link looks clickable, etc.).

### H. Imagery & visuals
- Images are sharp, relevant, and focused — not blurry, stretched, or generic filler.
- Visuals break up large blocks of text; long text uses bullets/sections for scannability.
- No broken images, placeholder boxes, or `lorem ipsum` shipped in a "done" screen.
- Every image has an explicit `aspect-ratio`/dimensions (no layout shift) and meaningful `alt`.

### I. Interaction states & feedback (the eight-state contract)
Every interactive component must define ALL of: default · hover · focus-visible · active ·
disabled · loading · error · success. `error` and `success` are the ones that get skipped.
- The system always shows its status: buttons show loading, lists show skeletons, actions confirm.
- Forms validate with immediate, specific feedback — not a generic "invalid" after submit.
- Empty states are designed (guidance + a next action), not a blank area.
- Destructive actions confirm before running.

### J. Navigation & wayfinding
- Navigation is clear; the user always knows where they are (active state on the current item).
- Depth has breadcrumbs or a clear back path; no dead ends.
- Users can undo / escape / go back (user control and freedom).

### K. Accessibility
- Semantic HTML (`<button>`, `<nav>`, `<main>`, real headings) — not clickable `<div>`s.
- Visible `:focus-visible` ring on every interactive element; fully keyboard-operable.
- Touch targets ≥ 44×44px on mobile.
- All form fields have associated labels.
- `prefers-reduced-motion` is honored.

### L. Responsive & layout safety
- Works at 375px with NO horizontal scroll.
- `overflow-x: clip` on BOTH `html` and `body`.
- Any grid track containing an image uses `minmax(0, 1fr)`, not bare `1fr`.
- No clickable text that wraps to two lines in nav items or CTAs.
- Display-size headings have `overflow-wrap: anywhere; min-width: 0`.
- Section layouts collapse to a single column on mobile.

### M. Motion hygiene
- Animate `transform`/`opacity` only (not `top`/`left`/`width`/`height`).
- Durations are short (< 300ms for UI feedback); easing is consistent.
- NEVER `transition-all` — always name the properties (`transition-[transform,opacity]`).
- No gratuitous, distracting, or looping animation.

### N. Content & copy integrity (treat fabrication as Critical — it's a liability)
- Flag any quantitative/factual claim I did NOT supply: invented conversion metrics
  ("+47% conversion"), social proof ("trusted by 50,000+ teams"), benchmarks ("10× faster"),
  fake testimonials/logos, or pricing/guarantees I never specified. Replace each with a
  visible placeholder (`—` + "metric to confirm") — do not swap in a different invented number.
- Copy is scannable: short paragraphs, bullets for lists, clear microcopy on buttons/labels.

### O. Emotional tone & brand cohesion (judgment call — flag, don't silently "fix")
- Does the design evoke a coherent feeling that fits the product and audience, or does it
  read as generic template output?
- Is the `<nav>` the AI-default shape (wordmark-left · 4–5 centered links · one button-right ·
  hairline border)? If so, surface it as a question: deliberate, or inherited default?

### P. Marketing / landing-page anti-tells (only for marketing surfaces, NOT dashboards/tables)
These are the specific signatures an LLM reaches for when it tries to "look designed." They
apply to landing pages, marketing sections, portfolios, and hero areas — NOT to product UI
(dashboards, data tables, admin, multi-step forms), where consistent repetition is correct.
On marketing surfaces, flag each:
- **Em-dashes in user-facing copy.** The single most common AI tell. Scan every visible string
  — headlines, eyebrows, buttons, body, captions, alt text — for `—` (or `–` as a separator).
  Replace with a period, comma, colon, parentheses, or a plain hyphen. (This is about the
  rendered UI copy, not code comments or these docs.)
- **Section-number / status eyebrows.** `00 / INDEX`, `001 · Capabilities`, `06 · How it works`,
  `V0.6`, `BETA`, `INVITE-ONLY` above a heading. Name the topic in plain words or drop it.
- **Eyebrow overuse.** A small uppercase `tracking-wider` label above *every* section. Cap it:
  at most one per ~3 sections; the headline alone usually suffices.
- **Hero overflow.** Hero should fit the first viewport: headline ≤ 2 lines, subtext ≤ ~20 words,
  the primary CTA visible without scrolling. A 4-line headline is a font-size error.
- **Hero clutter.** Trust micro-strips ("Used by teams at…"), taglines under the CTAs, or a
  logo wall stuffed *inside* the hero. Move those to their own section below.
- **Three equal feature cards** in a row — the generic default. Vary composition (asymmetric,
  2-col zigzag capped at 2 in a row, bento with real cell-count = item-count).
- **Layout repetition.** The same section layout family reused down the page. A ~8-section page
  should use ≥ 4 distinct layout families.
- **Fake previews.** A product "screenshot" built from `<div>` rectangles (fake task lists,
  terminals, dashboards). Use a real screenshot/image or omit it.
- **Text wordmarks in a logo wall.** `<span>Acme</span>` rows instead of real SVG brand logos.
- **Decoration tells.** Weather/locale/time strips ("LIS 14:23 · 18°C"), scroll cues
  ("↓ scroll"), decorative status dots on every item, hero-bottom mono strips
  (`BRAND. MOTION. SPATIAL.`), version footers (`v1.4.2`, `Build 0048`) on a marketing page.
- **"Jane Doe" data.** Generic names (John Doe), startup-slop brands (Acme/Nexus), and
  fake-precise stats the brand never claimed (`99.99%`, `4.1×`) — overlaps rule N.
- **Cute-but-broken copy.** Re-read every string; flag AI-hallucinated wordplay, forced
  metaphors, or performative-craftsman labels ("Field notes", "On our desks"). Plain beats cute.
- **Unmotivated motion.** Animation with no job (hierarchy / feedback / storytelling / state).
  Also: more than one marquee per page, and any `window.addEventListener("scroll", …)` — use
  `IntersectionObserver` / GSAP ScrollTrigger instead.

## SEVERITY RUBRIC

- **Critical** — breaks usability or ships a falsehood: fabricated claims; body text failing
  WCAG AA; horizontal scroll / broken layout on mobile; unreadable or overlapping content;
  a form that can fail with no error state; a core flow not keyboard-operable.
- **High** — clearly undermines quality: inconsistent components; weak or absent hierarchy;
  off-palette colors; cluttered or empty-feeling layout; missing hover/focus states; unsized
  images causing layout shift; off-scale spacing/type throughout.
- **Medium** — polish: minor alignment drift, spacing-rhythm inconsistencies, sub-optimal
  line length, motion timing, small copy scannability issues.

## OUTPUT FORMAT

Structure the review as:
1. **Executive Summary** — count by severity + a one-paragraph verdict on whether this looks
   designed or default, and how closely it follows `design-style-guide.md`.
2. **Per-screen findings** — for each screen reviewed, the issues found.
3. **Critical / High / Medium sections** — each finding with:
   - The screen/component and file path (+ line numbers where it's a code fix)
   - Which principle or style-guide rule it violates
   - Why it matters to the user
   - The concrete fix, using the project's design tokens (never hardcoded values)
4. **Recommendations** — higher-level moves that would raise the design ceiling.

## CONTEXT

- Design source of truth: `design-style-guide.md` (palette, type scale, spacing, components).
- Stack: Next.js 16, Tailwind v4 (CSS-first `@theme` tokens in `globals.css`), shadcn/ui,
  Framer Motion, lucide-react. Fixes MUST use the CSS-variable tokens, never raw hex/px.
- Read `project-description.md` for the app's audience and intended tone.

Be specific and visual. Point to exact screens and elements. Every fix must respect the
existing design tokens.

After the review, write the findings to `pre-design-review-report.md` at the project root
so I can address them iteratively.
```

---

## After the Review

1. Read `pre-design-review-report.md` carefully.
2. Fix every **Critical** issue — a falsehood or an unusable/inaccessible screen ships harm.
3. Fix **High** issues before you call the UI done.
4. Schedule **Medium** polish for the next pass.
5. Re-run after any significant UI change, and once more before a public launch.
6. Every fix must use your `design-style-guide.md` tokens — if a fix needs a value the guide
   doesn't have, add it to the guide first, then use it. The guide stays the source of truth.

> Checklist synthesized from Nielsen Norman Group (design guidance & usability heuristics),
> the Webflow design-system checklist, developerux's UX principles checklist, and Jena
> Ehlers' "6-Point Checklist for an Effective Design." Layout-safety, honest-copy and
> eight-state rules are shared with VibeKit's `design-style-guide.md` and adapted in part
> from [Hallmark](https://github.com/nutlope/hallmark) (MIT © 2026 Hallmark contributors).
> The marketing-page anti-tells in section P are adapted from the production-tested catalog in
> [Taste Skill](https://github.com/Leonxlnx/taste-skill) (MIT © 2026 Leon Lin / Leonxlnx) —
> its stack-specific opinions (avoid Inter, avoid Lucide, per-page variance) are intentionally
> NOT adopted, because VibeKit standardizes on one locked design system + lucide-react.

---

*Part of the VibeKit Framework — github.com/MUKE-coder/vibekit*
