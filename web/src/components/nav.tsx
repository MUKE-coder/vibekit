"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Coffee, Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { LogoBadge } from "./graphics/logo-mark";
import { SITE } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Kept lean on purpose - the most important destinations only. Everything else
// (Setup, Performance, Resources) lives in the footer.
const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/showcase", label: "Showcase" },
  { href: "/tutorial", label: "Tutorial" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to >= md, and lock body scroll while open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition duration-300",
          scrolled ? "py-2 sm:py-3" : "py-3 sm:py-5",
        )}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <nav className="flex items-center justify-between gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group min-w-0 shrink-0">
              <LogoBadge className="transition-transform duration-200 group-hover:scale-105" />
              <span className="font-display text-[19px] tracking-tight text-[color:var(--text-primary)]">
                VibeKit
              </span>
            </Link>

            {/* Center pill of links (Shypt-style segmented nav) */}
            <div
              className={cn(
                "hidden md:flex items-center gap-0.5 rounded-[var(--radius-full)] border p-1 transition-colors",
                "border-[color:var(--border)] bg-[color:var(--bg-elevated)]/70 backdrop-blur-md",
              )}
            >
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-[var(--radius-full)] px-4 py-1.5 text-[14px] font-medium transition",
                      active
                        ? "bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] shadow-[var(--shadow-sm)]"
                        : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <ThemeToggle className="hidden sm:inline-flex" />

              {/* Buy me a coffee */}
              <Link
                href="/sponsor"
                title="Buy me a coffee"
                aria-label="Buy me a coffee"
                className="hidden sm:inline-grid h-9 w-9 place-items-center rounded-[var(--radius-full)] border border-[color:var(--border)] text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--accent)]"
              >
                <Coffee className="h-[17px] w-[17px]" />
              </Link>

              {/* GitHub */}
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                title="VibeKit on GitHub"
                aria-label="VibeKit on GitHub"
                className="hidden lg:inline-grid h-9 w-9 place-items-center rounded-[var(--radius-full)] border border-[color:var(--border)] text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
              >
                <Github className="h-[17px] w-[17px]" />
              </a>

              <Button href="/docs/quickstart" variant="accent" size="sm" className="hidden sm:inline-flex">
                Get started
              </Button>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-primary)]"
              >
                {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-opacity duration-300",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-[color:var(--bg)]/80 backdrop-blur-sm"
        />

        <div
          className={cn(
            "absolute top-0 inset-x-0 bg-[color:var(--bg-elevated)] border-b border-[color:var(--border)] shadow-[var(--shadow-xl)] transition-transform duration-300",
            menuOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
            <ul className="space-y-1">
              {[...navLinks, { href: "/resources", label: "Resources" }, { href: "/sponsor", label: "Buy me a coffee" }].map(
                (link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-md px-4 py-3 font-mono text-[14px] uppercase tracking-wider transition-colors",
                        isActive(pathname, link.href)
                          ? "bg-[color:var(--bg-subtle)] text-[color:var(--accent)]"
                          : "text-[color:var(--text-primary)] hover:bg-[color:var(--bg-subtle)]",
                      )}
                    >
                      {link.label}
                      <span className="text-[color:var(--text-tertiary)]">→</span>
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button href={SITE.github} variant="outline" size="md" className="w-full">
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <Button href="/docs/quickstart" variant="accent" size="md" className="w-full">
                Get started
              </Button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[color:var(--border)] pt-5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
