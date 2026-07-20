/**
 * Modules a USER's project provides, not the registry.
 *
 * Primitives are written to plug into an app that already has an auth layer, an
 * email sender, a route map, etc. Those imports are contract points, not
 * missing files — declaring them here keeps the harness focused on the
 * registry's own code rather than flagging the seams by design.
 *
 * If a primitive imports something NOT listed here and not shipped by the
 * registry, that is a genuine broken install and should fail the typecheck.
 */

declare module "@/lib/auth" {
  /** Better Auth (or equivalent) server instance. */
  export const auth: {
    api: {
      getSession: (opts: { headers: Headers }) => Promise<{
        user: { id: string; email: string; name?: string; role?: string } | null;
        session: { id: string; expiresAt: Date } | null;
      } | null>;
      [key: string]: (...args: any[]) => Promise<any>;
    };
    handler: (req: Request) => Promise<Response>;
    [key: string]: any;
  };
}

declare module "@/lib/auth-client" {
  export const authClient: {
    useSession: () => {
      data: { user: { id: string; email: string; name?: string; role?: string } | null } | null;
      isPending: boolean;
      error: Error | null;
    };
    signIn: Record<string, (...args: any[]) => Promise<any>>;
    signOut: (...args: any[]) => Promise<any>;
    [key: string]: any;
  };
}
