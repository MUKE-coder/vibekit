# Multi-Tenant Orgs & RBAC — VibeKit Reference

> The patterns every B2B SaaS needs but everyone re-invents: organizations, memberships, role-based access control, scoped query helpers, custom subdomains. This guide is the canonical setup for the framework's stack (Prisma v7 + Better Auth + Next.js 16).
>
> Use this when `project-description.md` → User roles has more than one role per organisation, OR the app supports multiple companies / tenants sharing the same deployment.

---

## When you need this

You're building multi-tenant if **any** of these are true:

- Users belong to companies, agencies, or teams
- Some users should manage / invite others (Owner / Admin)
- Different roles see different data (Owner sees billing, Viewer doesn't)
- Each tenant gets a custom subdomain (`acme.yourapp.com`) or slug (`yourapp.com/acme`)
- You need an audit log of who-did-what for SOC2 / compliance

If none apply → use Better Auth's single-user setup directly. Don't over-engineer.

---

## The data model

### Prisma schema

```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String?
  image         String?
  emailVerified Boolean       @default(false)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  memberships   Membership[]
  invitesSent   Invite[]      @relation("InviteSender")
  sessions      Session[]
  accounts      Account[]
}

model Organization {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  logo        String?
  /// Optional custom subdomain (e.g. "acme" → acme.yourapp.com)
  subdomain   String?      @unique
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  memberships Membership[]
  invites     Invite[]
  auditLogs   AuditLog[]

  @@index([slug])
  @@index([subdomain])
}

enum Role {
  OWNER   // Can do everything, including delete the org
  ADMIN   // Can invite/remove members, change settings, but cannot delete the org
  MEMBER  // Default — read + write data, no admin access
  VIEWER  // Read-only
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           Role         @default(MEMBER)
  createdAt      DateTime     @default(now())

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([userId, organizationId])
  @@index([organizationId])
  @@index([userId])
}

model Invite {
  id             String       @id @default(cuid())
  email          String
  organizationId String
  role           Role         @default(MEMBER)
  token          String       @unique
  expiresAt      DateTime
  acceptedAt     DateTime?
  senderId       String
  createdAt      DateTime     @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sender         User         @relation("InviteSender", fields: [senderId], references: [id])

  @@unique([email, organizationId])
  @@index([organizationId])
  @@index([token])
}

/// Every row in the audit log is hash-chained for tamper evidence — see audit-log.md
model AuditLog {
  id             String       @id @default(cuid())
  organizationId String
  actorId        String?
  action         String       // e.g. "member.invite", "settings.update", "billing.cancel"
  resource       String       // e.g. "user:abc", "invoice:123"
  metadata       Json?
  previousHash   String?
  rowHash        String       // SHA-256 of (previousHash + serialised row)
  createdAt      DateTime     @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId, createdAt])
  @@index([actorId])
}
```

### Foreign keys on tenant-scoped models

EVERY tenant-scoped model (Invoice, Customer, Project, etc.) MUST include `organizationId`:

```prisma
model Invoice {
  id             String       @id @default(cuid())
  organizationId String       // ← REQUIRED on every tenant model
  amount         Int
  // ... other fields
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId])
}
```

Forgetting this is how cross-tenant data leaks happen. Make it a rule reviewable by `grep`.

---

## Routing — slug vs subdomain

The framework supports two patterns:

### Pattern A: slug-based (default)

URL: `yourapp.com/[orgSlug]/dashboard`

```
src/app/
├─ (marketing)/page.tsx          ← public home
├─ auth/...                       ← sign-in / sign-up
└─ [orgSlug]/
   ├─ layout.tsx                  ← resolves org + checks membership
   ├─ dashboard/page.tsx
   ├─ members/page.tsx
   └─ settings/page.tsx
```

Simpler. Use this by default.

### Pattern B: subdomain-based

URL: `acme.yourapp.com/dashboard`

Use `middleware.ts` (Next 16 — keep `middleware.ts`, NOT `proxy.ts` — see troubleshooting.md) to rewrite:

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const host = req.headers.get("host") ?? "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!; // e.g. "yourapp.com"

  // Skip if not a subdomain
  if (!host.endsWith(`.${rootDomain}`)) return NextResponse.next();
  const subdomain = host.replace(`.${rootDomain}`, "");
  if (subdomain === "www" || subdomain === "app") return NextResponse.next();

  // Rewrite acme.yourapp.com/dashboard → /_subdomain/acme/dashboard
  url.pathname = `/_subdomain/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
```

Then routes live at `src/app/_subdomain/[subdomain]/...`. More complex DNS setup (wildcard cert, Cloudflare). Use when customers expect their own URL.

---

## The organization resolver (server component)

Drop this in `src/lib/org.ts`. Every server component / route uses it.

```ts
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

export type OrgContext = {
  org: { id: string; slug: string; name: string };
  user: { id: string; email: string };
  membership: { role: Role };
};

/**
 * Resolve the current organization context for a server component.
 * Throws (redirects) if the user isn't signed in or isn't a member.
 */
export async function requireOrg(slug: string): Promise<OrgContext> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/auth/sign-in");

  const org = await db.organization.findUnique({ where: { slug } });
  if (!org) notFound();

  const membership = await db.membership.findUnique({
    where: { userId_organizationId: { userId: session.user.id, organizationId: org.id } },
  });
  if (!membership) {
    // Not a member — show a friendly access-denied, not a generic 404
    redirect("/no-access");
  }

  return {
    org: { id: org.id, slug: org.slug, name: org.name },
    user: { id: session.user.id, email: session.user.email },
    membership: { role: membership.role },
  };
}
```

Use in layouts:

```tsx
// src/app/[orgSlug]/layout.tsx
import { requireOrg } from "@/lib/org";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const ctx = await requireOrg(orgSlug);
  // ctx is now available to children via context provider, or pass down via props
  return <OrgProvider value={ctx}>{children}</OrgProvider>;
}
```

---

## Permission helpers

```ts
// src/lib/permissions.ts
import type { Role } from "@/generated/prisma/client";

type Permission =
  | "org.delete"
  | "org.settings.update"
  | "member.invite"
  | "member.remove"
  | "member.role.update"
  | "billing.manage"
  | "data.read"
  | "data.write";

const matrix: Record<Permission, Role[]> = {
  "org.delete":          ["OWNER"],
  "org.settings.update": ["OWNER", "ADMIN"],
  "member.invite":       ["OWNER", "ADMIN"],
  "member.remove":       ["OWNER", "ADMIN"],
  "member.role.update":  ["OWNER", "ADMIN"],
  "billing.manage":      ["OWNER"],
  "data.read":           ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
  "data.write":          ["OWNER", "ADMIN", "MEMBER"],
};

export function can(role: Role, permission: Permission): boolean {
  return matrix[permission].includes(role);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new Error(`FORBIDDEN: ${permission} requires one of ${matrix[permission].join(", ")}`);
  }
}
```

Use it everywhere:

```ts
// Server component
const ctx = await requireOrg(orgSlug);
if (!can(ctx.membership.role, "billing.manage")) {
  return <NotAuthorized />;
}
```

```ts
// API route
const ctx = await requireOrg(orgSlug);
requirePermission(ctx.membership.role, "member.invite");
// proceeds only if allowed
```

```tsx
// Client component — receive role from server, gate UI
{can(role, "billing.manage") && <BillingTab />}
```

---

## Scoped query helpers

Wrap every Prisma query that touches tenant data so you can't forget `where: { organizationId }`:

```ts
// src/lib/scoped-db.ts
import { db } from "@/lib/db";

export function scopedDb(organizationId: string) {
  return {
    invoice: {
      findMany: (args: Parameters<typeof db.invoice.findMany>[0] = {}) =>
        db.invoice.findMany({
          ...args,
          where: { ...args.where, organizationId },
        }),
      findUnique: (id: string) =>
        db.invoice.findFirst({ where: { id, organizationId } }),
      create: (data: Omit<Parameters<typeof db.invoice.create>[0]["data"], "organizationId">) =>
        db.invoice.create({ data: { ...data, organizationId } }),
      // ... mirror update / delete with the same guard
    },
    // Repeat for every tenant-scoped model
  };
}
```

```ts
// Usage in a server component
const ctx = await requireOrg(slug);
const scoped = scopedDb(ctx.org.id);
const invoices = await scoped.invoice.findMany({ orderBy: { createdAt: "desc" } });
// IMPOSSIBLE to leak across tenants
```

---

## Invite flow

### API route: POST /api/[orgSlug]/invites

```ts
// src/app/api/[orgSlug]/invites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { requireOrg } from "@/lib/org";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db";
import { sendInviteEmail } from "@/lib/emails";
import { recordAudit } from "@/lib/audit"; // see audit-log.md

const BodySchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const ctx = await requireOrg(orgSlug);
  requirePermission(ctx.membership.role, "member.invite");

  const body = BodySchema.parse(await req.json());

  // 7-day token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const invite = await db.invite.create({
    data: {
      email: body.email,
      organizationId: ctx.org.id,
      role: body.role,
      token,
      expiresAt,
      senderId: ctx.user.id,
    },
  });

  await sendInviteEmail({
    to: body.email,
    inviterName: ctx.user.email,
    orgName: ctx.org.name,
    link: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${token}`,
  });

  await recordAudit({
    organizationId: ctx.org.id,
    actorId: ctx.user.id,
    action: "member.invite",
    resource: `invite:${invite.id}`,
    metadata: { email: body.email, role: body.role },
  });

  return NextResponse.json({ id: invite.id });
}
```

### Accept route: /invite/[token]

```tsx
// src/app/invite/[token]/page.tsx
import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export default async function AcceptInvite({
  params,
}: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await db.invite.findUnique({ where: { token } });
  if (!invite) notFound();
  if (invite.expiresAt < new Date()) return <div>Invite expired.</div>;
  if (invite.acceptedAt) return <div>Already accepted.</div>;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    // Bounce to sign-in, return back here after auth
    redirect(`/auth/sign-in?callbackUrl=/invite/${token}`);
  }

  if (session.user.email !== invite.email) {
    return <div>This invite is for {invite.email}. Sign in as that account.</div>;
  }

  await db.$transaction([
    db.membership.create({
      data: {
        userId: session.user.id,
        organizationId: invite.organizationId,
        role: invite.role,
      },
    }),
    db.invite.update({
      where: { id: invite.id },
      data: { acceptedAt: new Date() },
    }),
  ]);

  const org = await db.organization.findUniqueOrThrow({ where: { id: invite.organizationId } });
  redirect(`/${org.slug}/dashboard`);
}
```

---

## Org-switcher UI

Use the **JB Organization & Team UI** component for the member directory, invite dialog, settings panel:

```bash
pnpm dlx shadcn@latest add https://vibekit.desishub.com/r/org-team-ui.json
```

That gives you a ready-made member directory + invite flow. Wire its actions to the API routes above.

---

## Migration from single-user to multi-tenant

If the app started single-user and needs to migrate:

1. Run a backfill migration:
   - Create a default Organization for every existing User (`name: User.name + "'s workspace"`, `slug: random`)
   - Create a Membership row (`role: OWNER`)
   - Add `organizationId` to every existing tenant-scoped row using the default org
2. Make `organizationId` `NOT NULL` only AFTER the backfill completes (Prisma migration in two phases)
3. Update every query to use `scopedDb(org.id)` instead of bare `db`
4. Ship the migration behind a feature flag and verify in staging before flipping in prod

---

## Reference

- **Audit log pattern (hash-chained, tamper-evident):** [`audit-log.md`](./audit-log.md)
- **Component:** [`jb-components.md` → Organization & Team UI](./jb-components.md)
- **Auth:** [JB Better Auth UI](./jb-components.md)
- **DB patterns:** [`database-guide.md`](./database-guide.md)

---

_Last updated: 2026-05-14_
