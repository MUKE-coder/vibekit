import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <div className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
          404 · Not found
        </div>
        <h1 className="font-display mt-4 text-[clamp(3rem,8vw,5rem)] leading-none text-[color:var(--text-primary)]">
          Page not found
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
          The page you're looking for doesn't exist - or it never did.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Button variant="accent" size="md">
              Back home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
