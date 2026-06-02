"use client";

import * as React from "react";
import { Avatar as ShadAvatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.ComponentProps<typeof ShadAvatar> {
  /** Image src; falls back to initials if missing or fails to load. */
  src?: string | null;
  /** Person/entity name. Used for alt text and initials fallback. */
  name: string;
  /** Optional explicit initials override (max 2 chars). Defaults to deriving from `name`. */
  initials?: string;
  /** Optional status indicator (e.g. "online" / "away") — small dot on bottom-right. */
  status?: "online" | "away" | "busy" | "offline" | null;
  /** Visual size token. Default: md. */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASS: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

const STATUS_CLASS: Record<NonNullable<AvatarProps["status"]>, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  busy: "bg-red-500",
  offline: "bg-muted-foreground",
};

function deriveInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("") || "?";
}

/**
 * Drop-in Avatar with auto-initials fallback and an optional status dot.
 * Wraps the shadcn primitive — same API surface, but you don't write the
 * fallback boilerplate at every call site.
 */
export function Avatar({
  src,
  name,
  initials,
  status = null,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const fallback = initials ?? deriveInitials(name);
  return (
    <span className="relative inline-flex shrink-0">
      <ShadAvatar {...props} className={cn(SIZE_CLASS[size], className)}>
        {src ? <AvatarImage src={src} alt={name} /> : null}
        <AvatarFallback className="font-medium">{fallback}</AvatarFallback>
      </ShadAvatar>
      {status ? (
        <span
          aria-label={status}
          className={cn(
            "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
            STATUS_CLASS[status],
          )}
        />
      ) : null}
    </span>
  );
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum visible avatars before showing a `+N` count. Default: 4. */
  max?: number;
  /** Avatars to display — pass the children as `<Avatar>` nodes. */
  children: React.ReactNode;
  size?: AvatarProps["size"];
}

/**
 * Stacked avatar group with overlap. Caps at `max` and shows the overflow
 * count as a final muted avatar.
 *
 *   <AvatarGroup max={3}>
 *     {users.map(u => <Avatar key={u.id} name={u.name} src={u.image} />)}
 *   </AvatarGroup>
 */
export function AvatarGroup({ max = 4, size = "sm", children, className, ...props }: AvatarGroupProps) {
  const items = React.Children.toArray(children);
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div {...props} className={cn("flex -space-x-2", className)}>
      {visible.map((child, i) => (
        <span key={i} className="ring-2 ring-background rounded-full">
          {child}
        </span>
      ))}
      {overflow > 0 ? (
        <span className="ring-2 ring-background rounded-full">
          <ShadAvatar className={cn(SIZE_CLASS[size ?? "sm"])}>
            <AvatarFallback className="text-muted-foreground">+{overflow}</AvatarFallback>
          </ShadAvatar>
        </span>
      ) : null}
    </div>
  );
}
