"use client";

import * as React from "react";
import { Check, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Saved views — named filter + sort + column combos a user can switch
 * between with one click. Powers the "📌 My Open Bugs", "Quarter to
 * date by rep", "Onboarding pipeline" UX of mature SaaS apps.
 *
 * A saved view persists the *entire URL query string* of a list page.
 * That means it composes for free with `useTableState`, `useFilters`,
 * `useColumnPreferences`, etc. — anything URL-driven snaps back.
 *
 *   <SavedViews
 *     viewKey="invoices"
 *     loadViews={async () => (await fetch("/api/views?key=invoices")).json()}
 *     createView={async (v) => (await fetch("/api/views", { method:"POST", body: JSON.stringify(v) })).json()}
 *     updateView={async (id, v) => { await fetch(`/api/views/${id}`, { method:"PATCH", body: JSON.stringify(v) }); }}
 *     deleteView={async (id) => { await fetch(`/api/views/${id}`, { method:"DELETE" }); }}
 *   />
 *
 * Server shape:
 *
 *   { id, name, viewKey: "invoices", query: "?status=paid&dir=desc", isDefault, ownerId }
 */

export interface SavedView {
  id: string;
  name: string;
  viewKey: string;
  query: string;
  isDefault?: boolean;
}

interface SavedViewsProps {
  viewKey: string;
  loadViews: () => Promise<SavedView[]>;
  createView: (input: Omit<SavedView, "id">) => Promise<SavedView>;
  updateView: (id: string, input: Partial<Omit<SavedView, "id" | "viewKey">>) => Promise<void>;
  deleteView: (id: string) => Promise<void>;
  className?: string;
}

export function SavedViews({
  viewKey,
  loadViews,
  createView,
  updateView,
  deleteView,
  className,
}: SavedViewsProps) {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentQuery = params.toString() ? `?${params.toString()}` : "";

  const queryKey = ["saved-views", viewKey] as const;
  const { data: views = [] } = useQuery({ queryKey, queryFn: loadViews });

  const active = views.find((v) => v.query === currentQuery);
  const defaultView = views.find((v) => v.isDefault);

  const [renaming, setRenaming] = React.useState<SavedView | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey });

  const create = useMutation({
    mutationFn: () =>
      createView({
        name: draftName.trim(),
        viewKey,
        query: currentQuery,
      }),
    onSuccess: () => {
      setCreating(false);
      setDraftName("");
      invalidate();
    },
  });

  const rename = useMutation({
    mutationFn: () => updateView(renaming!.id, { name: draftName.trim() }),
    onSuccess: () => {
      setRenaming(null);
      setDraftName("");
      invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: deleteView,
    onSuccess: invalidate,
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => updateView(id, { isDefault: true }),
    onSuccess: invalidate,
  });

  const applyView = (view: SavedView) => router.push(`${pathname}${view.query}`, { scroll: false });

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <Star className={cn("h-3.5 w-3.5", active ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} aria-hidden />
              <span className="max-w-[140px] truncate">{active ? active.name : defaultView?.name ?? "All"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Saved views</DropdownMenuLabel>
            {views.length === 0 ? (
              <DropdownMenuItem disabled className="text-muted-foreground">
                No saved views yet
              </DropdownMenuItem>
            ) : (
              views.map((view) => (
                <DropdownMenuItem
                  key={view.id}
                  className="flex items-center justify-between gap-2"
                  onSelect={() => applyView(view)}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    {view.query === currentQuery ? (
                      <Check className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden />
                    ) : (
                      <span className="h-3 w-3" />
                    )}
                    <span className="truncate">{view.name}</span>
                    {view.isDefault ? <span className="text-[10px] text-muted-foreground">default</span> : null}
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5 text-muted-foreground">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDefault.mutate(view.id);
                      }}
                      className="rounded p-1 hover:bg-muted hover:text-foreground"
                      aria-label="Set as default"
                    >
                      <Star className={cn("h-3 w-3", view.isDefault && "fill-amber-400 text-amber-400")} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenaming(view);
                        setDraftName(view.name);
                      }}
                      className="rounded p-1 hover:bg-muted hover:text-foreground"
                      aria-label="Rename"
                    >
                      <Pencil className="h-3 w-3" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove.mutate(view.id);
                      }}
                      className="rounded p-1 hover:bg-muted hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </span>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setCreating(true)} className="text-foreground">
              <Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Save current view
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={creating || renaming !== null} onOpenChange={(open) => { if (!open) { setCreating(false); setRenaming(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{renaming ? "Rename view" : "Save current view"}</DialogTitle>
          </DialogHeader>
          <Input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="e.g. Active high-priority"
            autoFocus
          />
          {!renaming ? (
            <p className="text-xs text-muted-foreground">
              Filters, sort, and column choices in the current URL will be saved.
            </p>
          ) : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCreating(false);
                setRenaming(null);
                setDraftName("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!draftName.trim() || create.isPending || rename.isPending}
              onClick={() => (renaming ? rename.mutate() : create.mutate())}
            >
              {renaming ? "Save changes" : "Save view"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
