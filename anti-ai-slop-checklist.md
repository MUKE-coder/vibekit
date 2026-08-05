# Anti-AI-Slop Design Audit - Portable Checklist and Fix Guide

A self-contained prompt you can hand to any AI coding agent, on **any project**
(React, Next, Vue, Svelte, Astro, plain HTML, or anything else). The agent walks
the whole codebase, scores how "AI-slop" the UI is as a **percentage**, gives you
a report, and then fixes the issues once you approve.

It has one strict rule that most design guides get wrong: **the agent never
invents brand assets or ships placeholders as final.** When it removes an emoji
standing in for a logo, or a placeholder image, it does not swap in another fake.
It tells you exactly which **official PNG or SVG** or **real photo** to hand it,
and lists them all in one place.

---

## How to use this

1. Open your AI agent (Claude Code, Cursor, Codex, Cline, Windsurf, etc.) at the
   **root of the project you want audited**.
2. Paste the whole prompt in the fenced block below.
3. The agent produces a **Slop-Free Score (%)**, a report, and an **"Assets I need
   from you"** list.
4. Review it. Give the agent the real assets it asked for.
5. Tell it to fix the issues. It fixes them using **your project's own design
   tokens** and leaves clearly-labeled slots for any asset it is still waiting on.

You do not need to edit this file. Everything the agent needs is in the prompt.

---

## The Prompt (copy everything in this block)

```
You are a senior product designer running an "anti-AI-slop" audit on THIS entire
codebase. Your job has four phases: MAP the code, SCORE it as a percentage,
REPORT the findings, and (after I approve) FIX them. Read this whole brief before
you start. Work from what the code will actually render, not from what it looks
like it intends.

################################################################################
# PHASE 0 - MAP THE CODEBASE (do this first, silently, then summarize)
################################################################################

1. Find every piece of UI: pages/routes, components, layouts, styles, and any
   content/data files that feed visible text or images.
2. Find the project's OWN design system: the token source of truth. Look for a
   Tailwind config, CSS custom properties (`:root { --... }`), a theme file, a
   design-tokens file, or a UI-kit. THIS is your source of truth. Every fix you
   later make MUST use these tokens, never hardcoded hex/px values. If there is
   no token system, say so, and infer the de-facto palette/scale from the code.
3. Classify each surface as MARKETING (landing pages, heroes, portfolios,
   marketing sections) or PRODUCT (dashboards, tables, admin, settings,
   multi-step forms). Some rules below apply to marketing surfaces only, because
   consistent repetition is correct in a data table and wrong on a landing page.
4. Output a short map: token source found (yes/no + where), list of the main
   surfaces, and which are marketing vs product.

################################################################################
# PHASE 1 - THE CHECKLIST (audit every item; note pass / partial / fail)
################################################################################

## A. Design-system consistency
- One primary accent color, used consistently. Flag a second competing accent.
- Colors, spacing, radii, and shadows come from the token system, not one-off
  hex/px values (`#3b82f6`, `p-[13px]`, `rounded-[7px]`).
- The same component (button, card, input, badge) looks and behaves the same
  everywhere. Flag divergent one-off variants.
- One icon library, used consistently. Flag mixing two icon sets.

## B. Typography
- At most two font families (one for display/body, optionally one mono). A third
  is slop.
- A consistent type scale. Flag ad-hoc sizes that exist nowhere else.
- Semantic, ordered headings: exactly one h1 per page, no skipping h2 to h4 just
  for size. Hierarchy comes from weight and size together, not raw scale alone.
- Body line length roughly 45 to 75 characters. Comfortable line-height (~1.5 body).
- Weight discipline: avoid 800/900 as body-adjacent defaults; do not pair only
  400 and 600 as the entire system if the brand wants more character.

## C. Color and contrast
- WCAG AA: body text at least 4.5:1 against its background; large text and UI
  boundaries at least 3:1. Compute this for the actual token values and flag any
  low-contrast text (light gray on white, dark text on a dark surface).
- Semantic colors used correctly (red = error/destructive, green = success).
- NO multi-color "AI" gradients (purple to pink to orange), and no gradient on
  `background-clip: text` unless the brand explicitly calls for it. If a text
  gradient appears on many headings, that is a mannerism: reserve it for one or
  two moments.
- Color is never the only signal (an error state also has text or an icon).

## D. Layout, hierarchy, and composition
- Each screen has ONE clear focal point; the primary action is the most prominent
  element.
- Elements align to a consistent grid; consistent page margins and gutters.
- Enough whitespace to breathe, not so much that relationships are lost.
- (Marketing) Hero fits the first viewport: headline at most 2 lines, subtext
  around 20 words, the primary CTA visible without scrolling. A 4-line headline
  is a font-size error.
- (Marketing) NO three equal feature cards in a row (the generic default). Vary
  composition. Cap "left-image / right-text" zigzag at two in a row. A bento grid
  has exactly as many cells as items (no empty tiles).
- (Marketing) Layout variety: an ~8-section page uses at least 4 different
  section layout families. Flag the same layout reused down the page.
- (Marketing) Eyebrow restraint: a small uppercase wide-tracking label above a
  heading is fine occasionally, but not above EVERY section. Cap it at roughly
  one per three sections.

## E. Interaction states (the eight-state contract)
Every interactive element must define all of: default, hover, focus-visible,
active, disabled, loading, error, success. `error` and `success` are the ones
that get skipped. Flag any control missing states it plausibly needs (a submit
button with no loading/disabled; a form field with no error style).
- The system always shows status: buttons show loading, lists show skeletons or
  empty states, destructive actions confirm.
- Any element that looks interactive must be interactive (no fake "Copy" label on
  a plain div, no button-styled span with no handler).

## F. Accessibility
- Semantic HTML: real `<button>`, `<nav>`, `<main>`, `<a>`, ordered headings.
  Flag clickable `<div>`s.
- A visible `:focus-visible` ring on every interactive element; fully
  keyboard-operable.
- Touch targets at least 44x44px on mobile.
- Every meaningful image has descriptive `alt`; decorative images have `alt=""`
  or `aria-hidden`.
- `prefers-reduced-motion` is honored. If the project uses a JS animation library
  (GSAP, Motion, anime.js), the CSS reduced-motion media query alone does NOT
  cover it; the animation code must check reduced-motion too.

## G. Responsive and layout safety
- Works at 375px wide with NO horizontal scroll.
- `overflow-x: clip` (not `hidden`) on both `html` and `body`.
- Any grid track that contains an image uses `minmax(0, 1fr)`, not bare `1fr`.
- No clickable text that wraps to two lines in nav items or CTA buttons.
- Display-size headings have `overflow-wrap: anywhere; min-width: 0`.
- Multi-column sections collapse to a single column on mobile.

## H. Motion hygiene
- Animate `transform` and `opacity` only, never `width/height/top/left`.
- NEVER `transition-all` / `transition: all`; name the exact properties.
- Durations short for UI feedback (under ~300ms); consistent easing.
- Motion must be motivated (hierarchy, feedback, storytelling, or state change),
  not "because the library is available".
- At most one horizontal marquee per page.
- NO `window.addEventListener("scroll", ...)` for scroll-driven animation; use
  IntersectionObserver or the animation library's scroll trigger.

## I. Content and copy honesty (treat fabrication as Critical - it is a liability)
- Flag any quantitative or factual claim that was invented rather than supplied by
  a real source: conversion or performance metrics ("+47% conversion", "saves 12
  hours a week"), social-proof counts ("trusted by 50,000+ teams"), benchmarks
  ("10x faster", "99.99% uptime"), fake testimonials (invented names, quotes,
  companies, avatars), customer or partner logos that were never named, or
  pricing/limits/guarantees nobody specified. These ship as factual claims on a
  real site. Replace each with a visible placeholder ("- metric to confirm") or
  remove it. Do NOT swap in a different invented number.
- Copy is scannable (short paragraphs, bullets for lists) and grammatically sound.
  Flag cute-but-broken AI copy: forced metaphors, performative-craftsman labels
  ("Field notes", "On our desks"), mock-poetic filler. Plain beats cute.
- NO em-dashes ("-" only) in user-facing UI copy: headlines, eyebrows, buttons,
  body, captions, alt text. The em-dash is the single most common AI writing
  tell. (This applies to RENDERED copy, not code comments.)

## J. AI "tells" (marketing surfaces - hard-flag unless the brief demands one)
- Section-number or status eyebrows: `00 / INDEX`, `001 - Capabilities`,
  `06 - How it works`, `V0.6`, `BETA`, `INVITE-ONLY` above a heading.
- Weather / locale / time strips ("LIS 14:23 - 18C") in nav or footer.
- Scroll cues ("Scroll", down-arrow, animated mouse-wheel). The user knows what
  scrolling is.
- Decorative status dots on every list item / nav link / badge, and fake
  "Live" / "Building" / "Online" liveness badges that reflect no real state.
- Hero-bottom mono strips ("BRAND. MOTION. SPATIAL."), version footers ("v1.4.2",
  "Build 0048") on a marketing page, photo-credit captions on stock images.
- Generic names ("John Doe", "Jane Smith"), startup-slop brands ("Acme", "Nexus",
  "SmartFlow"), and fake-precise numbers presented as data.
- Fake product previews built from `<div>` rectangles (fake dashboards, task
  lists, terminals) standing in for a screenshot.

## K. ASSET INTEGRITY  <-- READ THIS ONE CAREFULLY
This is the most important category and it has a strict, non-negotiable policy:
YOU NEVER INVENT OR FAKE A BRAND/IDENTITY ASSET, AND YOU NEVER SHIP A PLACEHOLDER
AS IF IT WERE FINAL. When you find one, you REMOVE the fake and REQUEST the real
thing from me. See PHASE 3 for exactly how. Flag every instance of:
- An emoji used as a logo, company mark, product icon, feature illustration,
  avatar, or hero graphic.
- A text wordmark (styled `<span>Acme</span>`) standing in for a real brand logo.
- Placeholder or random images: `picsum.photos`, `placehold.co`,
  `via.placeholder.com`, `source.unsplash.com/random`, gray/blurred boxes,
  `TODO: image` comments, or `<div>`-based fake screenshots used as real content.
- A hand-drawn decorative SVG substituting for a real logo or photo.
- A real-person photo that is actually a stock/placeholder face presented as a
  specific named person (fake testimonial avatars).

################################################################################
# PHASE 2 - SCORE IT (give me a percentage)
################################################################################

Assign a severity to each distinct finding:
- CRITICAL: ships a falsehood or breaks usability - fabricated claims/testimonials,
  body text failing WCAG AA, horizontal scroll / broken layout on mobile, a core
  flow not keyboard-operable, a faked brand asset presented as real.
- HIGH: clearly undermines quality - inconsistent components, weak/absent
  hierarchy, off-token colors, missing hover/focus states, `transition-all`
  everywhere, eyebrow on every section, placeholder images as final.
- MEDIUM: polish - minor alignment/spacing drift, motion timing, gradient-text
  overuse, sub-optimal line length.

Then compute the headline number:

  Slop-Free Score = max(0, 100 - (8 * #Critical + 4 * #High + 1.5 * #Medium))

Round to a whole number. Also give a letter grade:
  90-100 = A (ship it) · 75-89 = B (minor cleanup) · 60-74 = C (real work needed)
  · below 60 = D/F (systemic slop).

And a per-category line (A through K): for each, PASS / PARTIAL / FAIL plus the
count of findings. This shows me where the slop concentrates.

################################################################################
# PHASE 3 - THE ASSET REQUEST (the part you must not skip or fake)
################################################################################

For every ASSET INTEGRITY finding (category K), and for emojis found anywhere in
the UI, apply this decision:

1. Is the emoji/graphic a GENERIC UI affordance (a checkmark, arrow, chevron,
   menu, close, search, spinner)? If yes: replace it with a real icon from the
   project's existing icon library (or a well-known one: lucide, heroicons,
   phosphor, tabler). This does NOT need me to send anything.

2. Is it a BRAND or IDENTITY asset - a logo, a company/product mark, a specific
   named person's photo, a real product screenshot, or a hero/marketing image?
   If yes: DO NOT invent it. DO NOT substitute another emoji, a unicode glyph, a
   hand-drawn SVG, or a random stock image. Instead:
     a. Remove the fake from the code.
     b. Leave a clearly-labeled, minimal placeholder slot in its place, commented
        so it is obvious it is intentional and temporary, for example:
          {/* ASSET NEEDED: official <Acme> logo (SVG preferred). Placeholder. */}
     c. Add a line to the "ASSETS I NEED FROM YOU" list (below).

3. Placeholder / random / stock images used as real content: same as (2). Remove
   the placeholder, leave a labeled slot, and request the real image from me.

At the very end of your report, output a single consolidated list titled
**"ASSETS I NEED FROM YOU"** as a table with these columns:
  | What it is | Where it is used (file:line) | Format needed | Recommended size | Why |
Examples of rows:
  | Acme company logo | components/Nav.tsx:20 | SVG (or transparent PNG) | ~120x32, 2x for raster | replaces an emoji used as the logo |
  | Founder headshot (real person: "Sarah Chen") | components/Testimonials.tsx:44 | Photo (JPG/PNG), square | 400x400 | replaces a stock avatar on a named testimonial |
  | Product dashboard screenshot | components/Hero.tsx:88 | PNG screenshot | 1600x1000, 16:10 | replaces a div-based fake preview |

Be specific: tell me the exact thing, where it goes, the format (SVG for logos/
marks, PNG/JPG for photos/screenshots), and a recommended size or aspect ratio.
If you genuinely cannot tell what the asset should be, ask me a one-line question
rather than guessing.

################################################################################
# PHASE 4 - OUTPUT FORMAT
################################################################################

Structure your report as:
1. **Slop-Free Score: XX% (Grade Y)** - one headline line.
2. **Codebase map** - token source, surfaces (marketing vs product).
3. **Per-category scorecard** - A through K, PASS/PARTIAL/FAIL + finding counts.
4. **Findings** - grouped Critical, then High, then Medium. For each: the file
   and line, which rule it violates, why it matters to the user, and the concrete
   fix (using the project's own tokens).
5. **ASSETS I NEED FROM YOU** - the consolidated table from Phase 3.
6. **What I will fix vs what is blocked on your assets** - a short summary.

Do NOT fix anything yet. Wait for my go-ahead.

################################################################################
# PHASE 5 - FIX (only after I say go)
################################################################################

When I approve:
- Fix Critical issues first, then High, then Medium.
- Every fix uses the project's OWN design tokens. If a fix needs a value the token
  system does not have, add it to the token source first, then use it. Never
  hardcode a raw hex or px where a token exists.
- For generic-UI emojis: replace with real icon-library components.
- For brand/identity assets and placeholder images: leave the labeled slot in
  place (from Phase 3) and DO NOT invent a replacement. Once I provide the real
  asset, wire it in.
- Do NOT change product behavior or copy meaning; fix presentation and remove
  fabrications. For invented metrics/testimonials, replace with a visible
  placeholder or remove, per category I - never a different invented value.
- Re-run the score after fixing and report the new percentage, plus what is still
  blocked waiting on my assets.

Keep going until every unblocked Critical and High is resolved. Report the assets
still outstanding so I know exactly what to send you.
```

---

## Notes for you (the person running it)

- **The percentage is repeatable.** It is `100 - (8*Critical + 4*High +
  1.5*Medium)`, so the same codebase scores the same each run, and you can watch
  the number climb as you fix things and send assets.
- **Marketing vs product matters.** The strictest anti-tell rules (eyebrows,
  three-equal-cards, layout variety, "AI tells") are for landing/marketing
  surfaces. A dashboard or data table is *supposed* to be repetitive and dense;
  the agent is told not to punish it for that.
- **The asset rule is the whole point.** The agent will not paper over a missing
  logo with an emoji or a gray box. It removes the fake, marks the spot, and hands
  you a shopping list of exactly what to provide (format and size included). Give
  it the real SVGs/photos and it wires them in.
- **It uses your tokens, not mine.** There is nothing project-specific in the
  prompt; the agent discovers your own color/spacing/type system and fixes against
  it.

---

*Anti-slop rules synthesized from Nielsen Norman Group usability heuristics, the
Webflow design-system checklist, [Hallmark](https://github.com/nutlope/hallmark)
(MIT), and [Taste Skill](https://github.com/Leonxlnx/taste-skill) (MIT). Free to
copy and adapt. Written to be pasted into any AI coding agent, on any project.*
