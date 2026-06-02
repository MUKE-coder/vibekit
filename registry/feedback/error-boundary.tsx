"use client";

import * as React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Custom fallback. Receives error + retry callback. Defaults to a styled card. */
  fallback?: (error: Error, retry: () => void) => React.ReactNode;
  /** Called when an error is caught — wire to Sentry / your monitoring lib. */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** Reset key — when this value changes, the boundary clears its error state.
   *  Pass a route key, query params, or any value that should re-mount on change. */
  resetKey?: unknown;
  className?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * React error boundary with a styled default fallback (matches the design
 * tokens) and a `retry` callback that clears the boundary's error state.
 * Drop one at every major page block — Suspense handles loading, this
 * handles render errors.
 *
 *   <ErrorBoundary onError={Sentry.captureException}>
 *     <InvoiceList />
 *   </ErrorBoundary>
 *
 * Class component because the new React Error Boundary primitive is still
 * not stable enough across Next.js dev/build to depend on.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Clear error if the reset key changed (e.g. user navigated to a different route)
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  retry = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.retry);
      return (
        <DefaultFallback
          error={this.state.error}
          retry={this.retry}
          className={this.props.className}
        />
      );
    }
    return this.props.children;
  }
}

function DefaultFallback({
  error,
  retry,
  className,
}: {
  error: Error;
  retry: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8 text-center",
        className,
      )}
    >
      <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">Something went wrong</h3>
        <p className="max-w-md text-sm text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
      </div>
      <Button onClick={retry} size="sm" variant="outline">
        <RotateCw className="mr-2 h-3.5 w-3.5" aria-hidden /> Try again
      </Button>
    </div>
  );
}
