#!/usr/bin/env node
// Copies VibeKit prompt files from the repo root into web/ so the build can
// embed them even when deployed from web/ as the project root directory.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");

const filesToSync = ["CLAUDE_PROMPT.md", "pre-deploy-review.md", "pre-design-review.md"];

// A missing prompt file used to be a warning, which meant a broken quickstart
// page could ship on a green build. Collect failures and exit non-zero instead —
// but only when the file isn't already present in web/ (a deploy whose project
// root IS web/ has no repo root to copy from, and that's legitimate).
const missing = [];

let copied = 0;
for (const file of filesToSync) {
  const source = path.join(repoRoot, file);
  const dest = path.join(webRoot, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    copied++;
    console.log(`  ✓ synced ${file}`);
  } else if (fs.existsSync(dest)) {
    console.log(`  · ${file} already present in web/ — skipping`);
  } else {
    missing.push(`${file} (looked in ${source})`);
  }
}

// Sync setup-prompts/ folder (mac/windows/linux env-check prompts)
const setupSrcDir = path.join(repoRoot, "setup-prompts");
const setupDestDir = path.join(webRoot, "setup-prompts");
if (fs.existsSync(setupSrcDir)) {
  fs.mkdirSync(setupDestDir, { recursive: true });
  const setupFiles = fs.readdirSync(setupSrcDir).filter((f) => f.endsWith(".md"));
  for (const file of setupFiles) {
    fs.copyFileSync(path.join(setupSrcDir, file), path.join(setupDestDir, file));
    copied++;
    console.log(`  ✓ synced setup-prompts/${file}`);
  }
} else if (fs.existsSync(setupDestDir) && fs.readdirSync(setupDestDir).some((f) => f.endsWith(".md"))) {
  console.log(`  · setup-prompts/ already present in web/ — skipping`);
} else {
  missing.push(`setup-prompts/ (looked in ${setupSrcDir})`);
}

if (missing.length > 0) {
  console.error(`\n✖ sync-prompts: ${missing.length} required prompt source(s) missing:`);
  for (const m of missing) console.error(`    - ${m}`);
  console.error(
    `\nThese files are the product — building without them ships a broken quickstart page.`,
  );
  process.exit(1);
}

console.log(`Synced ${copied} prompt file(s) into web/`);
