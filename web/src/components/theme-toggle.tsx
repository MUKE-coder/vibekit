"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius)]",
        "border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-secondary)]",
        "transition-colors hover:text-[color:var(--text-primary)] hover:border-[color:var(--border-strong)]",
        className
      )}
    >
      <Sun className={cn("h-[18px] w-[18px] transition", isDark && "scale-0 -rotate-90 opacity-0")} aria-hidden />
      <Moon className={cn("absolute h-[18px] w-[18px] transition", !isDark && "scale-0 rotate-90 opacity-0")} aria-hidden />
    </button>
  );
}
