/**
 * Prisma client singleton. The instance is cached on `globalThis` so
 * Next.js's dev-server hot-reload doesn't open a new pool on every
 * file save (which exhausts Postgres connections in a few minutes).
 *
 *   import { db } from "@/lib/db";
 *   const users = await db.user.findMany();
 *
 * Wire any Prisma client extensions (soft-delete, audit, tenantScope)
 * here so every import path receives the same enhanced instance.
 *
 * Requires `output = "../lib/generated/prisma"` in your schema (no-src
 * layout). If your client generates elsewhere, fix the import path.
 */

import { PrismaClient } from "./generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
