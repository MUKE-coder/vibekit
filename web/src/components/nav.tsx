"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Github, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { LogoBadge } from "./graphics/logo-mark";
import { SITE } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/setup", label: "Setup" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/performance", label: "Performance" },
  { href: "/components", label: "Components" },
  { href: "/templates", label: "Templates" },
  { href: "/resources", label: "Resources" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
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
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled ? "py-2 sm:py-3" : "py-3 sm:py-5"
        )}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-6">
          <nav
            className={cn(
              "flex items-center justify-between gap-3 sm:gap-6 rounded-full px-2 sm:px-3 py-2 transition-all duration-300",
              scrolled
                ? "glass border border-[color:var(--border)] shadow-[var(--shadow-sm)]"
                : "border border-transparent"
            )}
          >
            <Link href="/" className="flex items-center gap-2 pl-1 sm:pl-2 group min-w-0">
              <LogoBadge />
              <span className="font-mono text-[13px] sm:text-[14px] font-medium uppercase tracking-wider text-[color:var(--text-primary)] truncate">
                VibeKit
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 text-sm text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors rounded-md"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:inline-flex" />
              <Button
                href={SITE.github}
                variant="outline"
                size="sm"
                className="hidden lg:inline-flex"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <Button href="#get-started" variant="accent" size="sm" className="hidden sm:inline-flex">
                Get started
              </Button>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-primary)]"
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
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          className="absolute inset-0 bg-[color:var(--bg)]/80 backdrop-blur-sm"
        />

        {/* Sheet */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 bg-[color:var(--bg-elevated)] border-b border-[color:var(--border)] shadow-[var(--shadow-xl)] transition-transform duration-300",
            menuOpen ? "translate-y-0" : "-translate-y-full"
          )}
        >
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-md px-4 py-3 font-mono text-[14px] uppercase tracking-wider text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-subtle)]"
                  >
                    {link.label}
                    <span className="text-[color:var(--text-tertiary)]">→</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                href={SITE.github}
                variant="outline"
                size="md"
                className="w-full"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              <Button
                href="#get-started"
                variant="accent"
                size="md"
                className="w-full"
              >
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
