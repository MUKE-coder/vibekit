#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AGENT_KEYS } from "../src/agents.mjs";
import { init } from "../src/init.mjs";
import { bold, cyan, dim, fail, log } from "../src/ui.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function version() {
  const pkg = JSON.parse(await readFile(path.resolve(__dirname, "..", "package.json"), "utf8"));
  return pkg.version;
}

function usage() {
  log(`
${bold("vibekit")} ${dim("— scaffold the VibeKit framework into a project")}

${bold("Usage")}
  ${cyan("npx vibekit init")} ${dim("[options]")}

${bold("Commands")}
  init            Install the framework files and your agent's rules file

${bold("Options")}
  --agent <name>  ${dim(`One of: ${AGENT_KEYS.join(", ")}, all`)}
  --global        ${dim("Install the Claude Code skill to ~/.claude instead of the project")}
  --dir <path>    ${dim("Target directory (default: current directory)")}
  --force         ${dim("Overwrite files that already exist")}
  --no-mcp        ${dim("Skip registering the Playwright MCP server")}
  --no-skills     ${dim("Skip installing the ui-ux-pro-max Claude Code skill")}
  --skills        ${dim("Install the skill even in non-interactive / CI runs")}
  -y, --yes       ${dim("Accept defaults, no prompts (for CI)")}
  -v, --version   ${dim("Print the version")}
  -h, --help      ${dim("Show this help")}

${bold("Examples")}
  ${dim("$")} npx vibekit init
  ${dim("$")} npx vibekit init --agent cursor
  ${dim("$")} npx vibekit init --agent all --force
  ${dim("$")} npx vibekit init --yes ${dim("# CI-friendly")}
`);
}

/** Minimal flag parser — avoids a dependency for six options. */
function parseArgs(argv) {
  const options = { _: [] };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
      case "-h":
        options.help = true;
        break;
      case "--version":
      case "-v":
        options.version = true;
        break;
      case "--yes":
      case "-y":
        options.yes = true;
        break;
      case "--force":
        options.force = true;
        break;
      case "--global":
        options.global = true;
        break;
      case "--no-mcp":
        options.mcp = false;
        break;
      case "--no-skills":
        options.skills = false;
        break;
      case "--skills":
        options.skills = true;
        break;
      case "--agent":
        options.agent = argv[++i]?.toLowerCase();
        break;
      case "--dir":
        options.dir = argv[++i];
        break;
      default:
        if (arg.startsWith("-")) {
          throw new Error(`Unknown option: ${arg}`);
        }
        options._.push(arg);
    }
  }

  // Validate options that take a value actually got one.
  if ("agent" in options && !options.agent) throw new Error("--agent requires a value");
  if ("dir" in options && !options.dir) throw new Error("--dir requires a value");

  return options;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (err) {
    fail(err.message);
    log(dim("Run `vibekit --help` for usage."));
    return 1;
  }

  if (options.version) {
    log(await version());
    return 0;
  }

  const command = options._[0];

  // Explicit --help is a success; a bare `vibekit` with no command is a usage error.
  if (options.help || !command) {
    usage();
    return options.help ? 0 : 1;
  }

  if (command !== "init") {
    fail(`Unknown command: ${command}`);
    log(dim("Run `vibekit --help` for usage."));
    return 1;
  }

  return init(options);
}

main()
  .then((code) => process.exit(code ?? 0))
  .catch((err) => {
    fail(err.message);
    if (process.env.DEBUG) console.error(err);
    process.exit(1);
  });
