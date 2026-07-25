import Link from "next/link";
import { SITE } from "@/lib/utils";

const cols = [
  {
    label: "Framework",
    links: [
      { name: "Beginner's guide (PDF)", href: "/vibekit-beginners-guide.pdf", download: true },
      { name: "Tutorial — TaskFlow course", href: "/tutorial" },
      { name: "Quickstart", href: "/docs/quickstart" },
      { name: "Components", href: "/components" },
      { name: "GitHub", href: SITE.github },
      { name: "CLAUDE_PROMPT.md", href: `${SITE.github}/blob/main/CLAUDE_PROMPT.md` },
      { name: "Pre-deploy review", href: `${SITE.github}/blob/main/pre-deploy-review.md` },
    ],
  },
  {
    label: "Reference",
    links: [
      { name: "Database guide", href: `${SITE.github}/blob/main/database-guide.md` },
      { name: "Deployment", href: `${SITE.github}/blob/main/deployment.md` },
      { name: "Environment vars", href: `${SITE.github}/blob/main/environment-variables.md` },
      { name: "Monetization", href: `${SITE.github}/blob/main/monetization-guide.md` },
      { name: "Troubleshooting", href: `${SITE.github}/blob/main/troubleshooting.md` },
    ],
  },
  {
    label: "Community",
    links: [
      { name: "Showcase — built with VibeKit", href: "/showcase" },
      { name: "Buy me a coffee", href: "/sponsor" },
      { name: "Join WhatsApp community", href: SITE.community },
      { name: "GitHub Discussions", href: `${SITE.github}/discussions` },
      { name: "Contribute a component", href: "/contribute" },
      { name: "JB Component Registry", href: "https://jb.desishub.com/blog/jb-component-registry-complete-reference" },
    ],
  },
  {
    label: "Author",
    links: [
      { name: "JB · Desishub", href: SITE.authorUrl },
      { name: "Desishub Technologies", href: "https://desishub.com" },
      { name: "YouTube", href: "https://www.youtube.com/@JBWEBDEVELOPER" },
      { name: "LinkedIn", href: "https://www.linkedin.com/in/muke-johnbaptist/" },
      { name: "TikTok", href: "https://www.tiktok.com/@jbdesishub" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {cols.map((col) => (
            <div key={col.label}>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                {col.label}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => {
                  const external = link.href.startsWith("http");
                  const linkClass =
                    "text-[14px] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors";
                  return (
                    <li key={link.name}>
                      {"download" in link && link.download ? (
                        // Static asset — a plain anchor with download, not next/link.
                        <a href={link.href} download className={linkClass}>
                          {link.name}
                        </a>
                      ) : external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[color:var(--border)] pt-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[color:var(--text-primary)] text-[color:var(--text-inverse)] font-mono text-[11px] font-bold">
              VK
            </span>
            <span className="font-display text-[16px] tracking-tight text-[color:var(--text-primary)]">
              VibeKit
            </span>
          </div>

          <p className="text-[13px] text-[color:var(--text-tertiary)]">
            MIT licensed · Built by{" "}
            <a
              href={SITE.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]"
            >
              JB (Muke Johnbaptist)
            </a>{" "}
            · Desishub Technologies
          </p>
        </div>
      </div>
    </footer>
  );
}
