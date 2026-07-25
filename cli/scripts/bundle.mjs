#!/usr/bin/env node
/**
 * Copies the framework files from the repo root into `cli/templates/` so the
 * published npm package is self-contained — `npx vibekit init` must work
 * offline and must ship the exact file versions that were tested with it.
 *
 * Runs automatically on `prepack`. `templates/` is gitignored: it's generated,
 * and committing a second copy of 165KB of markdown would guarantee drift.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(cliRoot, "..");
const templatesDir = path.join(cliRoot, "templates");

// A CRLF in the bin's shebang breaks `npx` on macOS/Linux ("env: node\r") and
// mangles the Windows cmd-shim — this shipped once (v0.3.0) after a publish from
// a Windows (autocrlf) checkout. Rather than just error, NORMALIZE the executed
// files to LF right before packing, so `npm publish` from any machine — even one
// whose working copy is CRLF — always produces a correct package. Self-healing
// beats a guard that would block a solo maintainer mid-publish.
for (const rel of ["bin/vibekit.mjs", "src/init.mjs", "src/mcp.mjs", "src/skills.mjs", "src/files.mjs", "src/agents.mjs", "src/ui.mjs"]) {
  const abs = path.join(cliRoot, rel);
  const original = readFileSync(abs, "utf8");
  const normalized = original.replace(/\r\n/g, "\n");
  if (normalized !== original) {
    writeFileSync(abs, normalized, "utf8");
    console.log(`  ↳ normalized ${rel} to LF`);
  }
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
