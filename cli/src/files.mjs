import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Bundled copies of the framework files, produced by scripts/bundle.mjs at pack time. */
export const TEMPLATES_DIR = path.resolve(__dirname, "..", "templates");

/**
 * The framework files that step 5 of the quickstart used to ask people to
 * download by hand from GitHub.
 */
export const FRAMEWORK_FILES = [
  { name: "master_prompt.md", purpose: "The coding constitution — rules the agent must follow" },
  { name: "jb-components.md", purpose: "Component registry reference" },
  { name: "pre-deploy-review.md", purpose: "Security audit prompt for pre-deploy review" },
];

/** Expands a leading `~` to the user's home directory. */
export function expandHome(p) {
  if (p === "~") return homedir();
  if (p.startsWith("~/") || p.startsWith("~\\")) return path.join(homedir(), p.slice(2));
  return p;
}

export async function readTemplate(name) {
  const file = path.join(TEMPLATES_DIR, name);
  if (!existsSync(file)) {
    throw new Error(
      `Bundled template "${name}" is missing from this package (looked in ${TEMPLATES_DIR}).\n` +
        `This is a packaging bug — please report it at https://github.com/MUKE-coder/vibekit/issues`,
    );
  }
  return readFile(file, "utf8");
}

/**
 * Writes `content` to `destination`, honouring the overwrite policy.
 * Returns "written" | "skipped" | "identical".
 */
export async function writeFileSafe(destination, content, { force = false } = {}) {
  const dest = expandHome(destination);

  if (existsSync(dest)) {
    const current = await readFile(dest, "utf8");
    // Re-running init after an upgrade is common; don't report a no-op as a change.
    if (current === content) return "identical";
    if (!force) return "skipped";
  }

  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, content, "utf8");
  return "written";
}

/** Relative-to-cwd display path, so output stays readable. */
export function displayPath(p, cwd) {
  const expanded = expandHome(p);
  const rel = path.relative(cwd, expanded);
  // If it escapes the project (e.g. a global ~/.claude path), show the original.
  return rel.startsWith("..") ? p : rel.split(path.sep).join("/");
}
