import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(__dirname, "..");
const BIN = path.join(cliRoot, "bin", "vibekit.mjs");

/** Runs the CLI, returning { code, stdout, stderr } without throwing on non-zero. */
async function vibekit(args, options = {}) {
  try {
    const { stdout, stderr } = await run(process.execPath, [BIN, ...args], {
      env: { ...process.env, NO_COLOR: "1" },
      ...options,
    });
    return { code: 0, stdout, stderr };
  } catch (err) {
    return { code: err.code ?? 1, stdout: err.stdout ?? "", stderr: err.stderr ?? "" };
  }
}

let dir;

before(async () => {
  // The package must be bundled before it can install anything.
  await run(process.execPath, [path.join(cliRoot, "scripts", "bundle.mjs")]);
});

describe("vibekit CLI", () => {
  before(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "vibekit-test-"));
  });

  after(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("--help exits 0", async () => {
    const { code, stdout } = await vibekit(["--help"]);
    assert.equal(code, 0);
    assert.match(stdout, /vibekit init/);
  });

  it("bare invocation exits 1 with usage", async () => {
    const { code, stdout } = await vibekit([]);
    assert.equal(code, 1);
    assert.match(stdout, /Usage/);
  });

  it("rejects an unknown agent", async () => {
    const { code, stderr } = await vibekit(["init", "--agent", "bogus", "--yes"]);
    assert.equal(code, 1);
    assert.match(stderr, /Unknown agent/);
  });

  it("rejects an unknown option", async () => {
    const { code, stderr } = await vibekit(["init", "--nope"]);
    assert.equal(code, 1);
    assert.match(stderr, /Unknown option/);
  });

  it("rejects --agent with no value", async () => {
    const { code, stderr } = await vibekit(["init", "--agent"]);
    assert.equal(code, 1);
    assert.match(stderr, /requires a value/);
  });

  it("rejects a nonexistent --dir", async () => {
    const { code, stderr } = await vibekit(["init", "--dir", path.join(dir, "nope"), "--yes"]);
    assert.equal(code, 1);
    assert.match(stderr, /does not exist/);
  });

  it("installs the framework files and the Claude skill", async () => {
    const { code } = await vibekit(["init", "--dir", dir, "--agent", "claude", "--yes"]);
    assert.equal(code, 0);

    for (const f of ["master_prompt.md", "jb-components.md", "pre-deploy-review.md"]) {
      assert.ok(existsSync(path.join(dir, f)), `${f} should exist`);
    }
    assert.ok(existsSync(path.join(dir, ".claude/skills/vibekit/SKILL.md")));

    // The skill must keep its frontmatter or Claude Code won't register it.
    const skill = await readFile(path.join(dir, ".claude/skills/vibekit/SKILL.md"), "utf8");
    assert.match(skill, /^---\r?\nname: vibekit/);
  });

  it("is idempotent — a second run reports no changes", async () => {
    const { code, stdout } = await vibekit(["init", "--dir", dir, "--agent", "claude", "--yes"]);
    assert.equal(code, 0);
    assert.match(stdout, /already up to date/);
    assert.doesNotMatch(stdout, /\d+ written/);
  });

  it("leaves a locally modified file alone without --force", async () => {
    const target = path.join(dir, "master_prompt.md");
    await writeFile(target, "MY EDITS", "utf8");

    const { stdout } = await vibekit(["init", "--dir", dir, "--agent", "claude", "--yes"]);
    assert.match(stdout, /exists, left alone/);
    assert.equal(await readFile(target, "utf8"), "MY EDITS");
  });

  it("overwrites with --force", async () => {
    const target = path.join(dir, "master_prompt.md");
    const { code } = await vibekit(["init", "--dir", dir, "--agent", "claude", "--yes", "--force"]);
    assert.equal(code, 0);
    assert.notEqual(await readFile(target, "utf8"), "MY EDITS");
  });

  it("--agent all writes every rules target exactly once", async () => {
    const allDir = await mkdtemp(path.join(tmpdir(), "vibekit-all-"));
    try {
      const { code, stdout } = await vibekit(["init", "--dir", allDir, "--agent", "all", "--yes"]);
      assert.equal(code, 0);

      for (const f of [
        ".claude/skills/vibekit/SKILL.md",
        ".cursor/rules/vibekit.mdc",
        ".clinerules",
        ".windsurfrules",
        "GEMINI.md",
        "AGENTS.md",
        ".cody/instructions.md",
        ".junie/guidelines.md",
      ]) {
        assert.ok(existsSync(path.join(allDir, f)), `${f} should exist`);
      }

      // Agents sharing AGENTS.md must not each rewrite it.
      assert.match(stdout, /already written/);
    } finally {
      await rm(allDir, { recursive: true, force: true });
    }
  });
});
