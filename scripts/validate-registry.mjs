#!/usr/bin/env node
/**
 * Enforces the registry invariants that have actually broken in the past.
 * Runs in CI; run it locally with `node scripts/validate-registry.mjs`.
 *
 * Each check exists because the corresponding breakage shipped to main:
 *   1. an item advertised in INDEX.md under a name no registry item has, so the
 *      documented install command 404s
 *   2. INDEX.md section counts drifting from reality
 *   3. a source file present on disk but declared by no item (never installed)
 *   4. a declared file that doesn't exist (install fails)
 *   5. two items sharing a name — shadcn is flat-namespaced, so one silently
 *      overwrites the other
 *   6. an import that no item declares, which is a broken install for every user
 */
import fs from "node:fs";
import { builtinModules } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const registryDir = path.join(repoRoot, "registry");

const errors = [];
const fail = (msg) => errors.push(msg);

// ── Load every category manifest ────────────────────────────────────────────
const categories = fs
  .readdirSync(registryDir)
  .filter((c) => fs.existsSync(path.join(registryDir, c, "registry.json")));

const itemsByName = new Map();
const declaredFiles = new Set();

for (const cat of categories) {
  const manifestPath = path.join(registryDir, cat, "registry.json");
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    fail(`registry/${cat}/registry.json is not valid JSON: ${err.message}`);
    continue;
  }

  for (const item of manifest.items ?? []) {
    if (!item.name) {
      fail(`registry/${cat}/registry.json has an item with no name`);
      continue;
    }

    // 5. Global name uniqueness.
    if (itemsByName.has(item.name)) {
      fail(
        `Duplicate item name "${item.name}" in registry/${cat} and registry/${itemsByName.get(item.name).cat} — ` +
          `shadcn installs are flat-namespaced, so one would overwrite the other`,
      );
    }
    itemsByName.set(item.name, { ...item, cat });

    if (!item.type) fail(`Item "${item.name}" has no "type"`);

    for (const file of item.files ?? []) {
      if (!file.path) {
        fail(`Item "${item.name}" has a file entry with no "path"`);
        continue;
      }
      if (!file.type) fail(`Item "${item.name}" file "${file.path}" has no "type"`);

      const abs = path.join(registryDir, cat, file.path);
      // 4. Declared files must exist.
      if (!fs.existsSync(abs)) {
        fail(`Item "${item.name}" declares registry/${cat}/${file.path}, which does not exist`);
      }
      declaredFiles.add(path.relative(repoRoot, abs).split(path.sep).join("/"));
    }
  }
}

// ── 3. Every source file must be declared by exactly one item ───────────────
for (const cat of categories) {
  const dir = path.join(registryDir, cat);
  for (const entry of fs.readdirSync(dir)) {
    if (!/\.tsx?$/.test(entry)) continue;
    const rel = `registry/${cat}/${entry}`;
    if (!declaredFiles.has(rel)) {
      fail(`${rel} exists but no item declares it — it will never be installed`);
    }
  }
}

// ── 6. Every bare npm import must be declared in the item's dependencies ────
// Docblock examples contain illustrative imports, so comments are stripped first.
// React and Next are peer-provided by any Next.js app, so they are never
// declared per-item. Node builtins are resolved by the runtime — matched via
// the real builtin list so that unprefixed forms (`crypto`, `stream`) are
// recognised too, not just `node:crypto`.
const PEER_PROVIDED = /^(react$|react-dom|react\/|next$|next\/)/;
const NODE_BUILTINS = new Set(builtinModules);

const isRuntimeProvided = (pkg) =>
  PEER_PROVIDED.test(pkg) || pkg.startsWith("node:") || NODE_BUILTINS.has(pkg);

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

for (const [name, item] of itemsByName) {
  const declared = new Set(item.dependencies ?? []);

  for (const file of item.files ?? []) {
    const abs = path.join(registryDir, item.cat, file.path);
    if (!fs.existsSync(abs)) continue;

    const src = stripComments(fs.readFileSync(abs, "utf8"));

    // Three import forms, all of which install-break identically if undeclared:
    //   static      `import x from "pkg"` / `export … from "pkg"`
    //   dynamic     `import("pkg")`  — used for client-side code splitting
    //   commonjs    `require("pkg")`
    // Missing the dynamic form let an undeclared `import("qrcode")` pass.
    const specifiers = [
      ...[...src.matchAll(/\bfrom\s+["']([^"']+)["']/g)].map((m) => m[1]),
      ...[...src.matchAll(/\bimport\s*\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]),
      ...[...src.matchAll(/\brequire\s*\(\s*["']([^"']+)["']\s*\)/g)].map((m) => m[1]),
    ];

    for (const spec of specifiers) {
      if (spec.startsWith(".") || spec.startsWith("@/")) continue;

      // "@scope/pkg/sub" -> "@scope/pkg";  "pkg/sub" -> "pkg"
      const pkg = spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0];

      if (isRuntimeProvided(pkg)) continue;

      if (!declared.has(pkg)) {
        fail(
          `Item "${name}" imports "${pkg}" in ${file.path} but does not declare it in "dependencies" — ` +
            `installing it would produce a file importing a package the user never installed`,
        );
      }
    }
  }
}

// ── 1 & 2. INDEX.md must match the registry ────────────────────────────────
const indexPath = path.join(registryDir, "INDEX.md");
if (!fs.existsSync(indexPath)) {
  fail("registry/INDEX.md is missing — it is the discovery surface /vibekit-find greps");
} else {
  const lines = fs.readFileSync(indexPath, "utf8").split(/\r?\n/);

  let section = null;
  let claimed = 0;
  let counted = 0;
  let totalListed = 0;
  const listedNames = new Set();

  const closeSection = () => {
    if (section && claimed !== counted) {
      fail(`INDEX.md section "${section}" claims ${claimed} items but lists ${counted}`);
    }
  };

  for (const line of lines) {
    const heading = line.match(/^##\s+\d+\.\s+(.+?)\s+\((\d+)\s+items?\)/);
    if (heading) {
      closeSection();
      section = heading[1];
      claimed = Number(heading[2]);
      counted = 0;
      continue;
    }

    const entry = line.match(/^-\s+\*\*([a-z0-9-]+)\*\*/i);
    if (entry && section) {
      counted++;
      totalListed++;
      listedNames.add(entry[1]);
      if (!itemsByName.has(entry[1])) {
        fail(
          `INDEX.md advertises "${entry[1]}" but no registry item has that name — ` +
            `the documented install command would 404`,
        );
      }
    }
  }
  closeSection();

  for (const name of itemsByName.keys()) {
    if (!listedNames.has(name)) {
      fail(`Registry item "${name}" is missing from INDEX.md — agents grep that file to discover it`);
    }
  }

  if (totalListed !== itemsByName.size) {
    fail(`INDEX.md lists ${totalListed} items but the registry has ${itemsByName.size}`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
if (errors.length > 0) {
  console.error(`\n✖ Registry validation failed — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error(`  • ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `✓ Registry valid — ${itemsByName.size} items across ${categories.length} categories, ` +
    `${declaredFiles.size} files, INDEX.md in sync`,
);
