"use client";

import { useState } from "react";
import { Check, Coffee, Heart, Loader2, Sparkles, Star } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { cn, SITE } from "@/lib/utils";
import {
  SPONSOR_TIERS,
  ONE_TIME_AMOUNTS,
  SPONSOR_MAX_USD,
  type SponsorTierId,
  type SponsorInterval,
} from "@/config/sponsors";

export default function SponsorPage() {
  const [interval, setInterval] = useState<SponsorInterval>("once");
  const [tierId, setTierId] = useState<SponsorTierId>("sponsor");
  const [oneTime, setOneTime] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTier = SPONSOR_TIERS.find((t) => t.id === tierId)!;

  const amountUsd =
    interval === "month" ? selectedTier.price : isCustom ? parseFloat(customAmount) : oneTime;

  async function checkout() {
    setError("");

    if (interval === "once" && isCustom) {
      const parsed = parseFloat(customAmount);
      if (!customAmount || isNaN(parsed) || parsed < 1) {
        setError("Please enter a valid amount ($1 minimum).");
        return;
      }
      if (parsed > SPONSOR_MAX_USD) {
        setError(`Maximum is $${SPONSOR_MAX_USD}. Get in touch for larger sponsorships.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amountUsd * 100),
          interval,
          tier: interval === "month" ? selectedTier.name : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cardBase =
    "rounded-[var(--radius-lg)] border p-5 text-left transition";
  const cardSelected =
    "border-[color:var(--accent)] bg-[color:var(--bg-subtle)] ring-1 ring-[color:var(--accent)]";
  const cardIdle =
    "border-[color:var(--border)] bg-[color:var(--bg-elevated)] hover:border-[color:var(--border-strong)]";

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="mx-auto mb-6 inline-flex w-fit items-center gap-2 rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-1.5">
            <Coffee className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              Support the project
            </span>
          </div>
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
            Buy the maintainer <em className="not-italic gradient-text">a coffee</em>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
            VibeKit is free, open source, and built in the open by one developer. A one-time tip or
            a monthly sponsorship funds the primitives, the docs, and the next release - and keeps
            it free for everyone.
          </p>
        </section>

        {/* Plans */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-14">
          {/* Interval toggle */}
          <div className="mb-10 flex justify-center">
            <div
              role="tablist"
              aria-label="Sponsorship frequency"
              className="inline-flex rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-1"
            >
              {(
                [
                  { id: "once", label: "One-time" },
                  { id: "month", label: "Monthly" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={interval === opt.id}
                  onClick={() => {
                    setInterval(opt.id);
                    setError("");
                  }}
                  className={cn(
                    "rounded-[var(--radius-full)] px-6 py-2 text-sm font-medium transition",
                    interval === opt.id
                      ? "bg-[color:var(--accent)] text-[color:var(--accent-fg)]"
                      : "text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {interval === "month" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {SPONSOR_TIERS.map((tier) => {
                const selected = tierId === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setTierId(tier.id);
                      setError("");
                    }}
                    className={cn(cardBase, "relative flex flex-col", selected ? cardSelected : cardIdle)}
                  >
                    {tier.featured && (
                      <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-[var(--radius-full)] border border-[color:var(--accent)] bg-[color:var(--bg)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Popular
                      </span>
                    )}
                    <h3 className="font-display text-lg tracking-tight text-[color:var(--text-primary)]">
                      {tier.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-3xl tracking-tight text-[color:var(--text-primary)]">
                        ${tier.price}
                      </span>
                      <span className="text-sm text-[color:var(--text-tertiary)]">/month</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[color:var(--text-secondary)]">
                      {tier.blurb}
                    </p>
                    <ul className="mt-4 flex-1 space-y-2 border-t border-[color:var(--border)] pt-4">
                      {tier.perks.map((perk) => (
                        <li key={perk} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--accent)]" />
                          <span className="text-xs text-[color:var(--text-secondary)]">{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <span
                      className={cn(
                        "mt-5 block rounded-[var(--radius-full)] py-2 text-center text-sm font-medium transition-colors",
                        selected
                          ? "bg-[color:var(--accent)] text-[color:var(--accent-fg)]"
                          : "border border-[color:var(--border-strong)] text-[color:var(--text-primary)]",
                      )}
                    >
                      {selected ? "Selected" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-xl">
              <div className="mb-4 grid grid-cols-3 gap-3">
                {ONE_TIME_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setOneTime(amount);
                      setIsCustom(false);
                      setError("");
                    }}
                    className={cn(
                      cardBase,
                      "text-center",
                      !isCustom && oneTime === amount ? cardSelected : cardIdle,
                    )}
                  >
                    <Coffee className="mx-auto mb-1.5 h-4 w-4 text-[color:var(--accent)]" />
                    <span className="font-display text-2xl tracking-tight text-[color:var(--text-primary)]">
                      ${amount}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsCustom(true);
                  setError("");
                }}
                className={cn(cardBase, "w-full", isCustom ? cardSelected : cardIdle)}
              >
                <span className="text-sm font-medium text-[color:var(--text-primary)]">Custom amount</span>
                {isCustom && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-medium text-[color:var(--text-tertiary)]">$</span>
                    <input
                      type="number"
                      min="1"
                      max={SPONSOR_MAX_USD}
                      step="1"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] px-3 text-[15px] text-[color:var(--text-primary)] outline-none focus-visible:border-[color:var(--accent)] focus-visible:ring-1 focus-visible:ring-[color:var(--accent)]"
                    />
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Checkout */}
          <div className="mx-auto mt-10 max-w-xl">
            {error && <p className="mb-4 text-center text-sm text-[color:var(--danger,#e5484d)]">{error}</p>}
            <button
              onClick={checkout}
              disabled={loading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[color:var(--accent)] text-base font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter] duration-150 hover:brightness-110 active:brightness-95 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  {interval === "month"
                    ? `Sponsor $${selectedTier.price}/month`
                    : `Send $${isCustom && customAmount ? customAmount : oneTime}`}
                </>
              )}
            </button>
            <p className="mt-4 text-center text-[12px] text-[color:var(--text-tertiary)]">
              {interval === "month"
                ? "Cancel any time. Payments processed securely by Stripe - no card details touch our servers."
                : "Payments processed securely by Stripe - no card details touch our servers."}
            </p>
          </div>
        </section>

        {/* Where support goes */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 mt-24">
          <div className="text-center">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-tight text-[color:var(--text-primary)]">
              Where your support goes
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
              Every contribution funds the work that keeps VibeKit free and getting better.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
            {[
              "New primitives and framework improvements",
              "Documentation, tutorials, and the beginner's guide",
              "Bug fixes and security patches",
              "Community support and issue triage",
              "Registry + site hosting costs",
              "Keeping it MIT-licensed and free, forever",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                <span className="text-sm text-[color:var(--text-secondary)]">{point}</span>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-[13px] text-[color:var(--text-tertiary)]">
            Prefer GitHub Sponsors or a different method?{" "}
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4 hover:no-underline"
            >
              Reach out on GitHub
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
