/**
 * Audit log system. `recordAudit(...)` writes a single typed event row;
 * `auditMiddleware` wraps any Prisma write to log it automatically;
 * `getAuditLog(...)` reads back the trail for a record or actor.
 *
 *   // explicit:
 *   await recordAudit({
 *     actorId: session.user.id,
 *     orgId,
 *     action: "project.archive",
 *     targetType: "project",
 *     targetId: project.id,
 *     meta: { reason: "stale" },
 *   });
 *
 *   // automatic (writes get logged via a Prisma middleware):
 *   const db = withAudit(rawDb, () => ({ actorId: ctx.userId, orgId: ctx.orgId }));
 *
 * Schema requirement:
 *
 *   model AuditLog {
 *     id         String   @id @default(cuid())
 *     createdAt  DateTime @default(now())
 *     actorId    String?
 *     orgId      String?
 *     action     String
 *     targetType String?
 *     targetId   String?
 *     meta       Json?
 *     @@index([orgId, createdAt])
 *     @@index([actorId, createdAt])
 *     @@index([targetType, targetId])
 *   }
 *
 * Pair with the `audit-log-list` component for an in-app viewer.
 */

import { Prisma } from "./generated/prisma";
import { db } from "@/lib/db";
import { captureError } from "@/lib/monitoring";

export interface AuditEvent {
  actorId?: string | null;
  orgId?: string | null;
  action: string;
  targetType?: string;
  targetId?: string;
  meta?: Record<string, unknown>;
}

export async function recordAudit(event: AuditEvent): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: event.actorId ?? null,
        orgId: event.orgId ?? null,
        action: event.action,
        targetType: event.targetType ?? null,
        targetId: event.targetId ?? null,
        meta: (event.meta as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });
  } catch (err) {
    // Never let audit failure break the user-facing action.
    captureError(err, { stage: "audit.write", action: event.action });
  }
}

interface AuditContext {
  actorId?: string | null;
  orgId?: string | null;
}

const WRITE_ACTIONS = new Set(["create", "update", "upsert", "delete", "deleteMany", "updateMany"]);

/**
 * Wrap a Prisma client so every write also produces an AuditLog row.
 * `getContext()` is called per-operation so request-scoped clients can
 * supply the current user / org without globals.
 */
export function withAudit(client: typeof db, getContext: () => AuditContext): typeof db {
  return client.$extends({
    name: "audit",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);
          if (!WRITE_ACTIONS.has(operation) || model === "AuditLog") return result;

          const ctx = getContext();
          const targetId =
            typeof result === "object" && result !== null && "id" in result
              ? String((result as { id: unknown }).id)
              : undefined;

          await recordAudit({
            actorId: ctx.actorId,
            orgId: ctx.orgId,
            action: `${(model ?? "model").toLowerCase()}.${operation}`,
            targetType: model?.toLowerCase(),
            targetId,
            meta: { args: safeJson(args) },
          });

          return result;
        },
      },
    },
  }) as unknown as typeof db;
}

interface GetAuditLogArgs {
  orgId?: string;
  actorId?: string;
  targetType?: string;
  targetId?: string;
  action?: string;
  /** ISO date. */
  since?: string | Date;
  take?: number;
  cursor?: string;
}

export async function getAuditLog(args: GetAuditLogArgs) {
  const where: Prisma.AuditLogWhereInput = {
    ...(args.orgId && { orgId: args.orgId }),
    ...(args.actorId && { actorId: args.actorId }),
    ...(args.targetType && { targetType: args.targetType }),
    ...(args.targetId && { targetId: args.targetId }),
    ...(args.action && { action: args.action }),
    ...(args.since && { createdAt: { gte: new Date(args.since) } }),
  };
  return db.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: args.take ?? 50,
    ...(args.cursor && { skip: 1, cursor: { id: args.cursor } }),
  });
}

function safeJson(value: unknown): Prisma.InputJsonValue {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return {};
  }
}
