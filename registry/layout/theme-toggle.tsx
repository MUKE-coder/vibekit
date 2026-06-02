"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Standardised theme toggle backed by `next-themes`. Three-way selector
 * (Light / Dark / System) — System follows the OS preference. The
 * trigger renders the active mode's icon and swaps with a hydration-safe
 * placeholder so there's no flash on load.
 *
 *   // In your topbar:
 *   <ThemeToggle />
 *
 *   // Or the simpler binary cycle version (no dropdown):
 *   <ThemeToggle variant="cycle" />
 *
 * Requires `next-themes` and your root `<ThemeProvider attribute="class">`
 * — set up via Better Auth UI or your own root layout.
 */

interface ThemeToggleProps {
  /** "dropdown" exposes Light / Dark / System; "cycle" toggles light↔dark only. */
  variant?: "dropdown" | "cycle";
  className?: string;
}

export function ThemeToggle({ variant = "dropdown", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Mount gate dodges the SSR mismatch (theme is "undefined" on first render)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" className={cn(className)}>
        <Sun className="h-4 w-4" aria-hidden />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";
  const ActiveIcon = theme === "system" ? Monitor : isDark ? Moon : Sun;

  if (variant === "cycle") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className={cn(className)}
      >
        <Sun className={cn("h-4 w-4 transition-all", isDark && "rotate-90 scale-0")} aria-hidden />
        <Moon
          className={cn("absolute h-4 w-4 transition-all", isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0")}
          aria-hidden
        />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme" className={cn(className)}>
          <ActiveIcon className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={(v) => setTheme(v)}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 h-3.5 w-3.5" aria-hidden /> Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 h-3.5 w-3.5" aria-hidden /> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 h-3.5 w-3.5" aria-hidden /> System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
