/**
 * Stand-in for the generated Prisma client.
 *
 * Real projects run `prisma generate` into `lib/generated/prisma`, producing a
 * client typed against THAT project's schema. There is no schema here, so the
 * delegates are loose. This is enough to typecheck the primitives' own logic
 * (extension shapes, `$extends` callbacks, argument threading) without
 * inventing a schema the framework doesn't own.
 */
declare module "*/generated/prisma" {
  export type PrismaClientOptions = Record<string, unknown>;

  /**
   * Shape of the callback Prisma hands to a `query` extension. Typed precisely
   * (rather than left as `unknown`) so that primitives destructuring
   * `{ model, operation, args, query }` are checked instead of silently
   * degrading to `any` — that degradation would hide the exact class of bug
   * this harness exists to catch.
   */
  export interface OperationContext {
    model?: string;
    operation: string;
    args: any;
    query: (args: any) => Promise<any>;
  }

  type OperationHook = (ctx: OperationContext) => unknown;

  export interface QueryExtension {
    $allOperations?: OperationHook;
    [operation: string]: OperationHook | undefined;
  }

  export interface ClientExtension {
    name?: string;
    query?: {
      $allModels?: QueryExtension;
      [model: string]: QueryExtension | undefined;
    };
    model?: Record<string, unknown>;
    result?: Record<string, unknown>;
    client?: Record<string, unknown>;
  }

  export class PrismaClient {
    constructor(options?: PrismaClientOptions);
    $extends(extension: ClientExtension): PrismaClient;
    // Prisma accepts BOTH an interactive callback and an array of promises.
    $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T>;
    $transaction<T extends readonly unknown[]>(operations: T): Promise<T>;
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
    $executeRaw(query: TemplateStringsArray, ...values: unknown[]): Promise<number>;
    $on(event: string, callback: (...args: unknown[]) => void): void;
    [model: string]: any;
  }

  export namespace Prisma {
    type InputJsonValue = string | number | boolean | null | InputJsonValue[] | { [k: string]: InputJsonValue };
    type JsonValue = InputJsonValue;
    type PrismaClientKnownRequestError = Error & { code?: string; meta?: Record<string, unknown> };
    type Middleware = (params: unknown, next: (params: unknown) => Promise<unknown>) => Promise<unknown>;
    type TransactionClient = Omit<PrismaClient, "$transaction" | "$connect" | "$disconnect">;
    /** JSON null sentinels — real Prisma exports these as runtime values. */
    const JsonNull: unique symbol;
    const DbNull: unique symbol;
    const AnyNull: unique symbol;

    /**
     * Schema-derived filter types. A real project generates one per model; the
     * registry only references this one, so it is declared explicitly rather
     * than faked with a catch-all.
     */
    type AuditLogWhereInput = Record<string, unknown>;

    const dmmf: { datamodel: { models: Array<{ name: string; fields: unknown[] }> } };
    function defineExtension(ext: unknown): unknown;
    function validator<T>(): (input: T) => T;
  }
}

declare module "*/generated/prisma/client" {
  export * from "*/generated/prisma";
}
