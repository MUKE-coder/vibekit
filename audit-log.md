# Audit Log — Tamper-Evident Hash-Chain Pattern

> Every B2B SaaS — especially anything aiming at SOC2 / ISO 27001 / regulated industries — needs an audit log of who-did-what-when. This guide is the framework's canonical implementation: a hash-chained append-only log where any tampering is detectable.
>
> Use this alongside [`multi-tenant.md`](./multi-tenant.md) — the AuditLog model is already defined there.

---

## What "tamper-evident" means

A hash chain links every row to the previous one via SHA-256. Mutating any past row breaks every subsequent hash, so a single check at audit time reveals tampering — including by someone with database write access.

It's not encryption. It's not preventing tampering. It's making tampering **provable**.

Auditors love this. SOC2 controls CC6.1, CC6.6, and CC7.2 lean on it heavily.

---

## When you need this

- **You need it:** SOC2, HIPAA, GDPR right-to-explanation, financial compliance, anywhere "who did X" must be answerable months later
- **You don't need it (yet):** Pre-seed apps, consumer products, prototypes — a simple `AuditLog` table without the hash chain is fine until you need attestation

Start without the chain. Add the chain when a customer requests SOC2 / an auditor asks. The schema in `multi-tenant.md` already has the `previousHash` + `rowHash` fields, so adding the chain later is just code — no migration.

---

## The schema

Already defined in [`multi-tenant.md`](./multi-tenant.md):

```prisma
model AuditLog {
  id             String       @id @default(cuid())
  organizationId String
  actorId        String?      // null = system action (e.g. cron job)
  action         String       // e.g. "member.invite", "settings.update"
  resource       String       // e.g. "user:abc", "invoice:123"
  metadata       Json?
  previousHash   String?      // hash of the previous row in this org's chain
  rowHash        String       // SHA-256 of (previousHash + serialised current row)
  createdAt      DateTime     @default(now())

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId, createdAt])
  @@index([actorId])
}
```

Key points:
- One chain per `organizationId` (multi-tenant isolation)
- `previousHash` references the last row's `rowHash`
- `rowHash` covers the meaningful fields, NOT the hash itself (would be circular)

---

## The append function

Use a serialisable transaction so concurrent writes can't race the chain:

```ts
// src/lib/audit.ts
import { createHash } from "crypto";
import { db } from "@/lib/db";

export type AuditInput = {
  organizationId: string;
  actorId?: string;
  action: string;
  resource: string;
  metadata?: Record<string, unknown>;
};

/**
 * Serialise the fields covered by the hash. Order matters — never change this.
 * Adding fields is fine; renaming or reordering breaks every existing chain.
 */
function canonicalise(row: {
  organizationId: string;
  actorId: string | null;
  action: string;
  resource: string;
  metadata: unknown;
  createdAt: Date;
}): string {
  return JSON.stringify({
    organizationId: row.organizationId,
    actorId: row.actorId ?? null,
    action: row.action,
    resource: row.resource,
    metadata: row.metadata ?? null,
    createdAt: row.createdAt.toISOString(),
  });
}

function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export async function recordAudit(input: AuditInput): Promise<void> {
  await db.$transaction(
    async (tx) => {
      const previous = await tx.auditLog.findFirst({
        where: { organizationId: input.organizationId },
        orderBy: { createdAt: "desc" },
      });

      const createdAt = new Date();
      const canonical = canonicalise({
        organizationId: input.organizationId,
        actorId: input.actorId ?? null,
        action: input.action,
        resource: input.resource,
        metadata: input.metadata ?? null,
        createdAt,
      });

      const previousHash = previous?.rowHash ?? null;
      const rowHash = sha256((previousHash ?? "") + canonical);

      await tx.auditLog.create({
        data: {
          organizationId: input.organizationId,
          actorId: input.actorId,
          action: input.action,
          resource: input.resource,
          metadata: (input.metadata ?? null) as never,
          previousHash,
          rowHash,
          createdAt,
        },
      });
    },
    { isolationLevel: "Serializable" }
  );
}
```

Important details:
- `Serializable` isolation — without it two concurrent inserts can both read the same `previous`, producing a fork. SQLite users: `Serializable` is the default; Postgres needs the explicit flag.
- `createdAt` is fixed once at the start of the transaction so the hash matches the committed row.
- Order of fields in `canonicalise()` is the schema of the chain — treat it as immutable. New fields can be appended (with a documented version bump); never reorder existing ones.

---

## When to record

Record AT LEAST these actions:

| Action | Why |
|---|---|
| `org.create`, `org.delete` | High-blast-radius operations |
| `org.settings.update` | Compliance + dispute resolution |
| `member.invite`, `member.remove`, `member.role.update` | Access control changes |
| `billing.subscribe`, `billing.cancel`, `billing.payment.*` | Financial reconciliation |
| `auth.signin`, `auth.signin.failed`, `auth.password.reset` | Security forensics |
| `data.export`, `data.delete.bulk` | GDPR + bulk data movement |
| `api.token.create`, `api.token.revoke` | API credential lifecycle |

DON'T record every CRUD operation — the log will become useless. Stick to operations a SOC2 auditor or your future self investigating an incident would want.

---

## Reading the log (for the org admin)

```tsx
// src/app/[orgSlug]/audit/page.tsx
import { requireOrg } from "@/lib/org";
import { requirePermission } from "@/lib/permissions";
import { db } from "@/lib/db";

export default async function AuditLogPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const ctx = await requireOrg(orgSlug);
  requirePermission(ctx.membership.role, "org.settings.update"); // Owner/Admin only

  const events = await db.auditLog.findMany({
    where: { organizationId: ctx.org.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold">Audit log</h1>
      <table className="mt-6 w-full">
        <thead>
          <tr>
            <th className="text-left">When</th>
            <th className="text-left">Actor</th>
            <th className="text-left">Action</th>
            <th className="text-left">Resource</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.createdAt.toLocaleString()}</td>
              <td className="font-mono text-xs">{e.actorId ?? "system"}</td>
              <td>{e.action}</td>
              <td className="font-mono text-xs">{e.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
```

Add an export button (JSON / CSV) for auditors. Pagination via the framework's standard server-side pagination pattern.

---

## Verifying the chain

Run this as a periodic job (Vercel Cron / Upstash QStash) and surface failures via your alerting:

```ts
// src/lib/audit/verify.ts
import { createHash } from "crypto";
import { db } from "@/lib/db";

function canonicalise(row: any): string {
  return JSON.stringify({
    organizationId: row.organizationId,
    actorId: row.actorId ?? null,
    action: row.action,
    resource: row.resource,
    metadata: row.metadata ?? null,
    createdAt: row.createdAt.toISOString(),
  });
}

function sha256(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

export type VerifyResult =
  | { ok: true; rows: number }
  | { ok: false; brokenAt: string; reason: string };

export async function verifyAuditChain(organizationId: string): Promise<VerifyResult> {
  const rows = await db.auditLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "asc" },
  });

  let previousHash: string | null = null;
  for (const row of rows) {
    if (row.previousHash !== previousHash) {
      return { ok: false, brokenAt: row.id, reason: "previousHash mismatch" };
    }
    const expected = sha256((previousHash ?? "") + canonicalise(row));
    if (row.rowHash !== expected) {
      return { ok: false, brokenAt: row.id, reason: "rowHash mismatch" };
    }
    previousHash = row.rowHash;
  }
  return { ok: true, rows: rows.length };
}
```

Schedule it nightly:

```ts
// src/app/api/cron/verify-audit/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuditChain } from "@/lib/audit/verify";

export async function GET(req: Request) {
  // Vercel Cron sets this header; reject anyone else
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orgs = await db.organization.findMany({ select: { id: true, slug: true } });
  const broken: { slug: string; brokenAt: string; reason: string }[] = [];

  for (const org of orgs) {
    const result = await verifyAuditChain(org.id);
    if (!result.ok) {
      broken.push({ slug: org.slug, brokenAt: result.brokenAt, reason: result.reason });
    }
  }

  if (broken.length > 0) {
    // Wire to whatever you use — Slack webhook, PagerDuty, Sentry capture
    console.error("AUDIT_CHAIN_BROKEN", broken);
  }
  return NextResponse.json({ broken, checked: orgs.length });
}
```

---

## What hash chains do NOT protect against

Be honest with yourself / your auditor:

- **Database wipe.** A hash chain proves tampering of existing rows. It doesn't prove the log is complete. For that you need off-site append-only storage (S3 with object lock, write-once buckets, or a managed log service like AWS CloudTrail / Datadog Audit Trail) and you mirror writes there too.
- **Code-level bypass.** If `recordAudit()` is never called, nothing is logged. Make recording a code-review checklist item for every mutating action. Or wrap critical mutations in helpers that auto-record.
- **Pre-chain history.** Anything before this guide was deployed isn't chained. For new compliance scope, the chain starts when you deploy.

---

## Reference

- **Multi-tenant + RBAC patterns:** [`multi-tenant.md`](./multi-tenant.md)
- **Database:** [`database-guide.md`](./database-guide.md) (Neon + Prisma v7)
- **SOC2 background:** "Trust Services Criteria" — Common Criteria CC6.1 (logical access), CC6.6 (logical access changes), CC7.2 (system monitoring)

---

_Last updated: 2026-05-14_
