import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

export const UIUX_REPO = "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill";
const UIUX_DIR = path.join(homedir(), ".claude", "skills", "ui-ux-pro-max");

/** Manual command shown whenever the automatic clone can't run. */
export const UIUX_MANUAL_CMD = `git clone --depth 1 ${UIUX_REPO} "${UIUX_DIR}"`;

function dirHasFiles(dir) {
  try {
    return readdirSync(dir).length > 0;
  } catch {
    return false;
  }
}

/**
 * Best-effort install of the ui-ux-pro-max-skill into the user-level Claude
 * skills directory. It is a Claude Code skill (a git repo of markdown), so the
 * only real install is a clone — this is the one init step that touches the
 * network, and it is deliberately NON-FATAL: on any failure init still succeeds
 * and prints the manual command.
 *
 * Returns { status, dir }. status:
 *   "installed"      – cloned just now
 *   "already"        – dir already present, left as-is
 *   "no-git"         – git not on PATH
 *   "failed"         – clone errored (network, etc.)
 */
export function installUiUxSkill() {
  if (dirHasFiles(UIUX_DIR)) {
    return { status: "already", dir: UIUX_DIR };
  }

  const clone = spawnSync(
    "git",
    ["clone", "--depth", "1", UIUX_REPO, UIUX_DIR],
    { stdio: "ignore" },
  );

  if (clone.error) {
    // ENOENT → git isn't installed.
    if (clone.error.code === "ENOENT") return { status: "no-git", dir: UIUX_DIR };
    return { status: "failed", dir: UIUX_DIR };
  }

  if (clone.status !== 0) {
    // Remove a half-written directory so a re-run starts clean.
    try {
      rmSync(UIUX_DIR, { recursive: true, force: true });
    } catch {
      /* best effort */
    }
    return { status: "failed", dir: UIUX_DIR };
  }

  return { status: "installed", dir: UIUX_DIR };
}
