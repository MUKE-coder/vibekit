"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Workspace / org switcher for the sidebar or topbar. Searchable list,
 * checkmark on active, plus a "Create organisation" action at the
 * bottom that fires `onCreate`.
 *
 *   <OrgSwitcher
 *     orgs={orgs}
 *     activeId={activeOrgId}
 *     onSelect={(id) => router.push(`/o/${id}`)}
 *     onCreate={() => router.push("/orgs/new")}
 *   />
 *
 * Designed to consume Better Auth's organisation plugin shape, but
 * works with any `{ id, name, slug?, logoUrl? }` list.
 */

export interface OrgOption {
  id: string;
  name: string;
  slug?: string | null;
  logoUrl?: string | null;
  role?: string;
}

interface OrgSwitcherProps {
  orgs: OrgOption[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate?: () => void;
  /** Label above the list. Default: "Workspaces". */
  groupLabel?: React.ReactNode;
  className?: string;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
}

export function OrgSwitcher({
  orgs,
  activeId,
  onSelect,
  onCreate,
  groupLabel = "Workspaces",
  className,
}: OrgSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const active = orgs.find((org) => org.id === activeId) ?? orgs[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn("h-10 w-full justify-between gap-2 px-2", className)}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={active?.logoUrl ?? undefined} />
              <AvatarFallback className="text-[10px]">
                {active ? initials(active.name) : "—"}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">
              {active?.name ?? "Select workspace"}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Search workspaces…" />
          <CommandList>
            <CommandEmpty>No workspaces found.</CommandEmpty>
            <CommandGroup heading={groupLabel}>
              {orgs.map((org) => (
                <CommandItem
                  key={org.id}
                  value={`${org.name} ${org.slug ?? ""}`}
                  onSelect={() => {
                    onSelect(org.id);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={org.logoUrl ?? undefined} />
                    <AvatarFallback className="text-[9px]">{initials(org.name)}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate">{org.name}</span>
                  {org.role ? <span className="text-[10px] text-muted-foreground">{org.role}</span> : null}
                  {org.id === activeId ? <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden /> : null}
                </CommandItem>
              ))}
            </CommandGroup>
            {onCreate ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      onCreate();
                    }}
                    className="flex items-center gap-2 text-foreground"
                  >
                    <span className="grid h-5 w-5 place-items-center rounded-full border border-border">
                      <Plus className="h-3 w-3" aria-hidden />
                    </span>
                    <span>Create workspace</span>
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
