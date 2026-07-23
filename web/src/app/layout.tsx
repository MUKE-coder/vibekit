import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { Analytics } from "zenith-analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ZENITH_PUBLIC } from "@/config/zenith";
import { SITE } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Claude Code",
    "Next.js framework",
    "vibe coding",
    "AI coding framework",
    "production SaaS template",
    "Prisma v7",
    "Better Auth",
    "Neon Postgres",
    "shadcn/ui",
    "AI app builder",
  ],
  authors: [{ name: "JB (Muke Johnbaptist)", url: SITE.authorUrl }],
  creator: "JB (Muke Johnbaptist)",
  publisher: "Desishub Technologies",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    siteName: SITE.name,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE.name }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/og.png"],
    creator: SITE.twitter,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* JSON-LD structured data */}
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE.name,
              url: SITE.url,
              description: SITE.description,
              author: {
                "@type": "Person",
                name: "JB (Muke Johnbaptist)",
                url: SITE.authorUrl,
              },
              publisher: {
                "@type": "Organization",
                name: "Desishub Technologies",
                url: "https://desishub.com",
              },
            }),
          }}
        />
        <Script
          id="ld-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: SITE.fullName,
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              description: SITE.description,
              url: SITE.url,
              author: { "@type": "Person", name: "JB (Muke Johnbaptist)" },
            }),
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {/* Server-rendered so the ~1KB tracker snippet is inlined into the HTML.
            Receives ZENITH_PUBLIC (backendUrl + siteKey only) — never
            ZENITH_CONFIG, which holds the secrets. Do not move into a client
            component or lazy-load it: the snippet finds its config via
            document.currentScript, which only works for server-inlined script. */}
        <Analytics config={ZENITH_PUBLIC} />
      </body>
    </html>
  );
}
