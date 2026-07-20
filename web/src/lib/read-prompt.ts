import fs from "node:fs";
import path from "node:path";

/**
 * Reads a markdown file from the VibeKit repo root at build time.
 * Tries multiple candidate paths so it works whether build cwd is web/ or the repo root.
 *
 * Pass nested paths like "setup-prompts/macos.md" to read OS-specific prompts.
 */
export function readPrompt(filename: string): string {
  const candidates = [
    path.resolve(process.cwd(), filename),             // synced into web/ by prebuild
    path.resolve(process.cwd(), "..", filename),       // build run from web/, files at repo root
    path.resolve(process.cwd(), "..", "..", filename), // nested deploy contexts
  ];

  for (const p of candidates) {
    try {
      const content = fs.readFileSync(p, "utf-8");
      if (content) return content;
    } catch {
      // try next candidate
    }
  }

  // Fail the production build rather than silently shipping a stub. These files
  // ARE the product: a missing CLAUDE_PROMPT.md turns the quickstart's copy
  // button into a dead link, and a green build gave no signal that it happened.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `readPrompt: "${filename}" not found. Tried:\n` +
        candidates.map((c) => `  - ${c}`).join("\n") +
        `\nRun "node scripts/sync-prompts.mjs" (the prebuild step) from web/ with the repo root available.`,
    );
  }

  // In dev, degrade gracefully so the site still runs from a partial checkout.
  return `# ${filename}\n\nCould not load this file at build time. View it on GitHub: https://github.com/MUKE-coder/vibekit/blob/main/${filename}`;
}
