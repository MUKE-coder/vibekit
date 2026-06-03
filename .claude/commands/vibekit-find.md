---
description: Find VibeKit primitives that match a feature request. Greps registry/INDEX.md for TRIGGERS matching the user's query.
allowed-tools: [Read, Grep, Bash]
---

# /vibekit-find — Primitive Discovery

Search the VibeKit Primitives index for components matching: **$ARGUMENTS**

## What to do

1. Run `Grep` against `registry/INDEX.md` (or the github URL if the file isn't local) with the user's phrase. Use case-insensitive matching across both TRIGGER phrases and item names. Search loosely — match parts of words.

2. **Report top 5 matches** as a compact list:
   ```
   - **<name>** — install: `pnpm dlx shadcn@latest add MUKE-coder/vibekit/<name>`
     <one-line description of what it does and why it fits>
   ```

3. If multiple matches look complementary (e.g. a hook + the UI that uses it), call that out: "*Install both — they pair together.*"

4. If you find **zero matches**, say so plainly. Suggest the closest near-misses if any, OR confirm the user should write fresh code.

5. End with: `Install all? (y/n)`. If yes, run the install commands sequentially via Bash.

## Style

- Don't dump the whole index. Top 5 max.
- Don't editorialise. Match → install command → one-line why.
- If the user's query is ambiguous, ask one clarifying question BEFORE searching.

## Example

User: `/vibekit-find filter by status and date range`

Response:
> Three matches:
> - **use-filters** — `pnpm dlx shadcn@latest add MUKE-coder/vibekit/use-filters` — Typed URL-synced filter state (multi/bool/range/date)
> - **filter-bar** — `pnpm dlx shadcn@latest add MUKE-coder/vibekit/filter-bar` — Composable faceted filter UI built on useFilters
> - **build-prisma-where** — `pnpm dlx shadcn@latest add MUKE-coder/vibekit/build-prisma-where` — Translates useFilters state to Prisma where
>
> *Install all three — they pair together for a list page.*
>
> Install all? (y/n)
