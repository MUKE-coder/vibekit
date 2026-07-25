/**
 * Single source of truth for sponsorship — the tier ladder and the one-time
 * amounts. Both the /sponsor page and the /api/checkout route read from here,
 * so a price is never hardcoded in two places.
 *
 * Perks are PROMISES — only list one that will actually be honoured.
 */

export type SponsorTierId = "supporter" | "backer" | "sponsor" | "partner";
export type SponsorInterval = "month" | "once";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** USD per month. Also the Stripe unit_amount (×100) for the monthly plan. */
  price: number;
  /** One-line pitch under the tier name. */
  blurb: string;
  perks: string[];
  /** The tier the UI visually leads with. */
  featured?: boolean;
}

/** The ladder, cheapest → dearest. The UI relies on this order. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    price: 5,
    blurb: "Buy the maintainer a coffee every month and keep VibeKit moving.",
    perks: [
      "A heartfelt thank-you",
      "Your name in the SPONSORS list on GitHub",
      "The warm feeling of funding open source",
    ],
  },
  {
    id: "backer",
    name: "Backer",
    price: 25,
    blurb: "For developers and small teams shipping with VibeKit.",
    perks: [
      "Everything in Supporter",
      "Your name + link in the VibeKit README",
      "Early word on new primitives and releases",
    ],
  },
  {
    id: "sponsor",
    name: "Sponsor",
    price: 100,
    blurb: "Top billing across the project — the sweet spot for companies.",
    perks: [
      "Everything in Backer",
      "Your logo on the VibeKit site",
      "Priority issue triage",
      "A say in what gets built next",
    ],
    featured: true,
  },
  {
    id: "partner",
    name: "Partner",
    price: 500,
    blurb: "VibeKit is core to your stack and you want everyone to know it.",
    perks: [
      "Everything in Sponsor",
      "Hero logo placement on the home page",
      "A direct line to the maintainer",
      "Priority support",
    ],
  },
];

/** One-time "buy me a coffee" amounts. `custom` is handled separately. */
export const ONE_TIME_AMOUNTS = [5, 25, 100] as const;

export const SPONSOR_MIN_USD = 1;
/** Mirrors the cap enforced in app/api/checkout/route.ts. */
export const SPONSOR_MAX_USD = 999;
