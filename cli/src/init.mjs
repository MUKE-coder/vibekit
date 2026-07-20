import { existsSync } from "node:fs";
import path from "node:path";

import { AGENTS, AGENT_KEYS, detectAgent } from "./agents.mjs";
import { FRAMEWORK_FILES, displayPath, readTemplate, writeFileSafe } from "./files.mjs";
import { bold, confirm, cyan, dim, fail, green, log, ok, select, skip, step, warn, isInteractive } from "./ui.mjs";

/**
 * `vibekit init` — replaces quickstart step 5.
 *
 * Previously the user had to open GitHub, download master_prompt.md,
 * jb-components.md and pre-deploy-review.md by hand, drop them in the project
 * root, then run a separate curl command to install the agent rules. Four manual
 * steps that silently half-complete if any one is skipped. This does all of it,
 * idempotently, and tells you exactly what changed.
 */
export async function init(options) {
  const cwd = path.resolve(options.dir ?? process.cwd());

  // Validate everything we can before printing the banner, so failures read as
  // errors rather than a half-finished run.
  if (!existsSync(cwd)) {
    fail(`Directory does not exist: ${cwd}`);
    return 1;
  }

  let agentKey = options.agent;

  if (agentKey && agentKey !== "all" && !AGENTS[agentKey]) {
    fail(`Unknown agent "${agentKey}". Supported: ${AGENT_KEYS.join(", ")}, all`);
    return 1;
  }

  log();
  log(bold(`  VibeKit`) + dim(" — framework setup"));
  log(dim(`  ${cwd}`));
  log();

  // ── Choose the agent ────────────────────────────────────────────────────
  if (!agentKey) {
    const detected = detectAgent(existsSync, path.join, cwd);

    if (options.yes || !isInteractive()) {
      agentKey = detected ?? "claude";
      if (!isInteractive() && !options.yes) {
        warn("Not a TTY — using defaults. Pass --agent to be explicit.");
      }
    } else {
      agentKey = await select(
        "Which coding agent are you using?",
        [
          ...AGENT_KEYS.map((k) => ({
            value: k,
            label: AGENTS[k].label,
            hint: k === detected ? "detected in this project" : undefined,
          })),
          { value: "all", label: "All of them", hint: "writes every rules file" },
        ],
        detected ?? "claude",
      );
    }
  }

  const targets = agentKey === "all" ? AGENT_KEYS : [agentKey];

  // ── Scope for Claude Code ───────────────────────────────────────────────
  let useGlobal = options.global ?? false;
  if (targets.includes("claude") && options.global === undefined && !options.yes && isInteractive()) {
    const scope = await select(
      "Where should the Claude Code skill go?",
      [
        { value: "project", label: "This project", hint: ".claude/skills/ — travels with the repo" },
        { value: "global", label: "All my projects", hint: "~/.claude/skills/" },
      ],
      "project",
    );
    useGlobal = scope === "global";
  }

  log();

  // ── 1. Framework files ──────────────────────────────────────────────────
  const results = { written: 0, skipped: 0, identical: 0 };
  const skippedPaths = [];

  step(`Framework files ${dim("→ project root")}`);
  for (const { name, purpose } of FRAMEWORK_FILES) {
    const content = await readTemplate(name);
    const dest = path.join(cwd, name);
    const result = await writeFileSafe(dest, content, { force: options.force });

    results[result]++;
    if (result === "written") ok(`${name} ${dim(`— ${purpose}`)}`);
    else if (result === "identical") skip(`${name} — already up to date`);
    else {
      skip(`${name} — exists, left alone`);
      skippedPaths.push(name);
    }
  }

  // ── 2. Agent rules ──────────────────────────────────────────────────────
  log();
  step(`Agent rules`);

  // Several agents share AGENTS.md; only write it once.
  const seen = new Set();

  for (const key of targets) {
    const agent = AGENTS[key];
    const relative = useGlobal && agent.global ? agent.global : agent.project;

    if (seen.has(relative)) {
      skip(`${agent.label} — uses ${relative}, already written`);
      continue;
    }
    seen.add(relative);

    const content = await readTemplate(agent.source === "skill" ? "SKILL.md" : "AGENTS.md");
    const dest = relative.startsWith("~") ? relative : path.join(cwd, relative);
    const result = await writeFileSafe(dest, content, { force: options.force });

    results[result]++;
    const shown = displayPath(dest, cwd);
    if (result === "written") ok(`${agent.label} ${dim(`→ ${shown}`)}${agent.note ? dim(` — ${agent.note}`) : ""}`);
    else if (result === "identical") skip(`${agent.label} — ${shown} already up to date`);
    else {
      skip(`${agent.label} — ${shown} exists, left alone`);
      skippedPaths.push(shown);
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  log();
  const parts = [];
  if (results.written) parts.push(green(`${results.written} written`));
  if (results.identical) parts.push(dim(`${results.identical} already current`));
  if (results.skipped) parts.push(`${results.skipped} skipped`);
  log(`  ${parts.join(dim(" · "))}`);

  if (skippedPaths.length > 0) {
    log();
    warn(`Left existing files alone. Re-run with ${cyan("--force")} to overwrite:`);
    for (const p of skippedPaths) log(`      ${dim(p)}`);
  }

  log();
  log(bold("  Next"));
  log(`  ${dim("1.")} Add your generated ${cyan("project-description.md")}, ${cyan("project-phases.md")},`);
  log(`     ${cyan("design-style-guide.md")} and ${cyan("prompt.md")} to this folder.`);
  log(`  ${dim("2.")} Open your agent and paste ${cyan("prompt.md")} to start Phase 1.`);
  log(`  ${dim("3.")} Before deploying, run ${cyan("pre-deploy-review.md")}.`);
  log();
  log(dim("  Docs: https://vibekit.desishub.com/docs/quickstart"));
  log();

  return 0;
}
