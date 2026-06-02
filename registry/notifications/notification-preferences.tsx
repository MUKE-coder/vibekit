"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Per-channel, per-type notification preferences UI. Reads the user's
 * current prefs, renders a Switch per notification type per channel,
 * persists on toggle (debounced).
 *
 *   <NotificationPreferences
 *     channels={[
 *       { id: "inApp", label: "In app" },
 *       { id: "email", label: "Email" },
 *     ]}
 *     types={[
 *       { id: "user.welcome",          label: "Welcome",         description: "When you join Acme" },
 *       { id: "invoice.paid",          label: "Invoice paid",    description: "When a customer pays you" },
 *       { id: "comment.mention",       label: "@mentions",       description: "When someone tags you in a comment" },
 *       { id: "weekly.digest",         label: "Weekly digest",   description: "A Monday summary of the week" },
 *     ]}
 *     load={async () => (await fetch("/api/me/notification-prefs")).json()}
 *     save={async (next) => { await fetch("/api/me/notification-prefs", { method: "PUT", body: JSON.stringify(next) }); }}
 *   />
 *
 * Prefs shape (matches the `notify` helper's expectation):
 *   { channel: "email" | "inApp"; mutedTypes: string[]; channelEnabled: boolean }[]
 *
 * Toggling the channel header disables every type for that channel
 * (single click, one save). Toggling a row disables just that type for
 * just that channel.
 */

export interface PreferencesChannel {
  id: string;
  label: React.ReactNode;
  /** Optional helper text under the channel header. */
  description?: React.ReactNode;
}

export interface PreferencesType {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export interface PreferencesState {
  /** Channel-id → "channel is on / off" */
  channelEnabled: Record<string, boolean>;
  /** Channel-id → set of type-ids that are MUTED for this channel */
  mutedTypes: Record<string, string[]>;
}

interface NotificationPreferencesProps {
  channels: PreferencesChannel[];
  types: PreferencesType[];
  load: () => Promise<PreferencesState>;
  save: (next: PreferencesState) => Promise<void>;
  /** Debounce window before save fires (ms). Default: 400. */
  saveDelayMs?: number;
  className?: string;
}

export function NotificationPreferences({
  channels,
  types,
  load,
  save,
  saveDelayMs = 400,
  className,
}: NotificationPreferencesProps) {
  const [state, setState] = React.useState<PreferencesState | null>(null);
  const [savingState, setSavingState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    void (async () => {
      try {
        const initial = await load();
        setState({
          channelEnabled: { ...Object.fromEntries(channels.map((c) => [c.id, true])), ...initial.channelEnabled },
          mutedTypes: { ...Object.fromEntries(channels.map((c) => [c.id, []])), ...initial.mutedTypes },
        });
      } catch {
        setState({
          channelEnabled: Object.fromEntries(channels.map((c) => [c.id, true])),
          mutedTypes: Object.fromEntries(channels.map((c) => [c.id, []])),
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function commit(next: PreferencesState) {
    setState(next);
    setSavingState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await save(next);
        setSavingState("saved");
        setTimeout(() => setSavingState("idle"), 1500);
      } catch {
        setSavingState("error");
      }
    }, saveDelayMs);
  }

  function toggleChannel(channelId: string, enabled: boolean) {
    if (!state) return;
    commit({
      ...state,
      channelEnabled: { ...state.channelEnabled, [channelId]: enabled },
    });
  }

  function toggleType(channelId: string, typeId: string, enabled: boolean) {
    if (!state) return;
    const muted = new Set(state.mutedTypes[channelId] ?? []);
    if (enabled) muted.delete(typeId);
    else muted.add(typeId);
    commit({
      ...state,
      mutedTypes: { ...state.mutedTypes, [channelId]: Array.from(muted) },
    });
  }

  if (!state) {
    return (
      <div className={cn("grid place-items-center py-12", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground">Choose what we contact you about and how.</p>
        </div>
        <span
          aria-live="polite"
          className={cn(
            "text-xs",
            savingState === "saving" && "text-muted-foreground",
            savingState === "saved" && "text-emerald-600 dark:text-emerald-400",
            savingState === "error" && "text-destructive",
          )}
        >
          {savingState === "saving"
            ? "Saving…"
            : savingState === "saved"
              ? "Saved"
              : savingState === "error"
                ? "Couldn't save"
                : null}
        </span>
      </div>

      {channels.map((channel) => {
        const channelOn = state.channelEnabled[channel.id] ?? true;
        const muted = state.mutedTypes[channel.id] ?? [];

        return (
          <section key={channel.id} className="rounded-lg border border-border bg-card">
            <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-foreground">{channel.label}</h3>
                {channel.description ? (
                  <p className="text-xs text-muted-foreground">{channel.description}</p>
                ) : null}
              </div>
              <Switch
                checked={channelOn}
                onCheckedChange={(v) => toggleChannel(channel.id, v)}
                aria-label={`Toggle all ${typeof channel.label === "string" ? channel.label : ""} notifications`}
              />
            </header>

            <ul className={cn("divide-y divide-border", !channelOn && "opacity-50")}>
              {types.map((type) => {
                const enabled = channelOn && !muted.includes(type.id);
                return (
                  <li key={type.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <div className="text-sm text-foreground">{type.label}</div>
                      {type.description ? (
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      ) : null}
                    </div>
                    <Switch
                      checked={enabled}
                      disabled={!channelOn}
                      onCheckedChange={(v) => toggleType(channel.id, type.id, v)}
                      aria-label={`${typeof type.label === "string" ? type.label : "Notification"} via ${typeof channel.label === "string" ? channel.label : "channel"}`}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
