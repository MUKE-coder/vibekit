#!/usr/bin/env node
/**
 * Copies the framework files from the repo root into `cli/templates/` so the
 * published npm package is self-contained — `npx vibekit init` must work
 * offline and must ship the exact file versions that were tested with it.
 *
 * Runs automatically on `prepack`. `templates/` is gitignored: it's generated,
 * and committing a second copy of 165KB of markdown would guarantee drift.
 */
import { existsSync, readFileSync } from "node:fs";
import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(cliRoot, "..");
const templatesDir = path.join(cliRoot, "templates");

// Guard: a CRLF in the bin's shebang breaks `npx` on macOS/Linux and mangles
// the Windows cmd-shim. This shipped once (v0.3.0) after a publish from a
// Windows checkout. Refuse to pack until it's LF. .gitattributes should keep it
// that way, but this makes a bad publish impossible even if that's bypassed.
const binPath = path.join(cliRoot, "bin", "vibekit.mjs");
if (readFileSync(binPath, "utf8").split("\n", 1)[0].includes("\r")) {
  console.error(
    `\n✖ bin/vibekit.mjs has a CRLF line ending — a CRLF shebang breaks npx.\n` +
      `  Fix: convert it to LF (see .gitattributes) before publishing.`,
  );
  process.exit(1);
}

/** [source path relative to repo root, name inside templates/] */
const SOURCES = [
  ["master_prompt.md", "master_prompt.md"],
  ["jb-components.md", "jb-components.md"],
  ["pre-deploy-review.md", "pre-deploy-review.md"],
  ["pre-design-review.md", "pre-design-review.md"],
  ["skill/SKILL.md", "SKILL.md"],
  ["skill/AGENTS.md", "AGENTS.md"],
];

const missing = SOURCES.filter(([src]) => !existsSync(path.join(repoRoot, src)));

if (missing.length > 0) {
  console.error(`\n✖ bundle: ${missing.length} source file(s) missing from ${repoRoot}:`);
  for (const [src] of missing) console.error(`    - ${src}`);
  console.error(`\nThe CLI cannot be packed without them — it would publish a broken init.`);
  process.exit(1);
}

await rm(templatesDir, { recursive: true, force: true });
await mkdir(templatesDir, { recursive: true });

for (const [src, dest] of SOURCES) {
  await copyFile(path.join(repoRoot, src), path.join(templatesDir, dest));
  console.log(`  ✓ ${src} → templates/${dest}`);
}

console.log(`Bundled ${SOURCES.length} file(s) into cli/templates/`);
