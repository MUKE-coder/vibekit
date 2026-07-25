import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Playwright MCP — gives the agent a real browser (navigate, click, fill, read
 * accessibility snapshots) so it can verify its own UI work. This is the safe
 * standard config; it does NOT enable the RCE-equivalent browser_run_code_unsafe
 * tool.
 */
export const PLAYWRIGHT_SERVER = {
  command: "npx",
  args: ["@playwright/mcp@latest"],
};

/**
 * Which config file each agent reads for project-scoped MCP servers, relative to
 * the project root. Both use the `mcpServers` schema. `.mcp.json` at the root is
 * the Claude Code default and a de-facto standard many MCP CLIs also read, so we
 * always write it; Cursor additionally reads `.cursor/mcp.json`.
 *
 * Agents not listed here (VS Code uses a different `servers` schema; Windsurf
 * uses a global file) get the standard `.mcp.json` plus a note to point their
 * client at it — we don't guess at global or differently-shaped configs.
 */
const MCP_TARGETS = {
  cursor: ".cursor/mcp.json",
};

function serversEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Merge the Playwright server into one MCP config file without disturbing any
 * other server the user already has. Returns a status for reporting.
 */
async function mergeInto(absPath, { force }) {
  let config = {};

  if (existsSync(absPath)) {
    let raw;
    try {
      raw = await readFile(absPath, "utf8");
      config = raw.trim() ? JSON.parse(raw) : {};
    } catch {
      // Don't clobber a file we can't parse — the user may have hand-edited it.
      return "unparseable";
    }
    if (typeof config !== "object" || config === null || Array.isArray(config)) {
      return "unparseable";
    }
  }

  if (typeof config.mcpServers !== "object" || config.mcpServers === null) {
    config.mcpServers = {};
  }

  const existing = config.mcpServers.playwright;
  if (existing) {
    if (serversEqual(existing, PLAYWRIGHT_SERVER)) return "identical";
    if (!force) return "exists"; // a different playwright server is already set
  }

  config.mcpServers.playwright = PLAYWRIGHT_SERVER;

  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, JSON.stringify(config, null, 2) + "\n", "utf8");
  return "written";
}

/**
 * Register Playwright MCP for the selected agents. Writes the standard project
 * `.mcp.json` plus any agent-specific config file we know about.
 * Returns [{ file, status }].
 */
export async function installPlaywrightMcp(cwd, targets, { force = false } = {}) {
  const files = new Set([".mcp.json"]); // always the standard project config
  for (const agent of targets) {
    if (MCP_TARGETS[agent]) files.add(MCP_TARGETS[agent]);
  }

  const results = [];
  for (const rel of files) {
    const status = await mergeInto(path.join(cwd, rel), { force });
    results.push({ file: rel, status });
  }
  return results;
}
