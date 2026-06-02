"use client";

import { useEffect } from "react";

/**
 * Warns the user before navigating away (browser back/refresh/close, or
 * any internal Next.js anchor click) when there are unsaved changes.
 *
 *   const form = useForm({...});
 *   useUnsavedChanges(form.formState.isDirty && !form.formState.isSubmitSuccessful);
 *
 * Two protection layers:
 *
 * 1. `beforeunload` — catches tab close, refresh, and direct URL changes.
 *    The browser shows a generic "Leave site?" dialog — message text is
 *    forced by every modern browser.
 * 2. Anchor capture — intercepts clicks on internal <a href> and shows a
 *    `confirm()` dialog before letting Next.js navigate. Hold meta/ctrl-
 *    click bypasses (open in new tab).
 *
 * For programmatic `router.push()` calls inside your own code, call
 * `confirm()` yourself or thread the dirty flag through your handler —
 * Next.js doesn't expose a router-level navigation hook for App Router yet.
 */
export function useUnsavedChanges(
  enabled: boolean,
  message = "You have unsaved changes. Leave anyway?",
) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      // Most browsers ignore the returnValue text but still show their dialog
      event.returnValue = message;
      return message;
    }

    function handleAnchorClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      // Allow new-tab / external / hash-only navigations
      if (event.metaKey || event.ctrlKey || event.shiftKey || anchor.target === "_blank") return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleAnchorClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [enabled, message]);
}
