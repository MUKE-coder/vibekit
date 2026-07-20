import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

// Colour only when we're attached to a real TTY and the user hasn't opted out.
// https://no-color.org/
const useColor = stdout.isTTY && !process.env.NO_COLOR;
const ESC = String.fromCharCode(27);
const wrap = (code) => (s) => (useColor ? `${ESC}[${code}m${s}${ESC}[0m` : s);

export const bold = wrap("1");
export const dim = wrap("2");
export const red = wrap("31");
export const green = wrap("32");
export const yellow = wrap("33");
export const cyan = wrap("36");

export const log = (msg = "") => console.log(msg);
export const step = (msg) => console.log(`${cyan("›")} ${msg}`);
export const ok = (msg) => console.log(`  ${green("✓")} ${msg}`);
export const skip = (msg) => console.log(`  ${dim("·")} ${dim(msg)}`);
export const warn = (msg) => console.log(`  ${yellow("!")} ${msg}`);
export const fail = (msg) => console.error(`${red("✖")} ${msg}`);

/** True when we can actually prompt — otherwise callers must fall back to defaults. */
export const isInteractive = () => stdin.isTTY && stdout.isTTY;

async function withReadline(fn) {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    return await fn(rl);
  } finally {
    rl.close();
  }
}

export async function confirm(question, defaultYes = true) {
  if (!isInteractive()) return defaultYes;
  return withReadline(async (rl) => {
    const hint = defaultYes ? "Y/n" : "y/N";
    const answer = (await rl.question(`${question} ${dim(`(${hint})`)} `)).trim().toLowerCase();
    if (!answer) return defaultYes;
    return answer === "y" || answer === "yes";
  });
}

/**
 * Single-choice list. `choices` is [{ value, label, hint }].
 * Returns the chosen value, or `defaultValue` when non-interactive.
 */
export async function select(question, choices, defaultValue) {
  if (!isInteractive()) return defaultValue;

  const defaultIndex = Math.max(
    0,
    choices.findIndex((c) => c.value === defaultValue),
  );

  return withReadline(async (rl) => {
    log();
    log(bold(question));
    choices.forEach((c, i) => {
      const marker = i === defaultIndex ? cyan("●") : dim("○");
      const hint = c.hint ? ` ${dim(c.hint)}` : "";
      log(`  ${marker} ${dim(`${i + 1})`)} ${c.label}${hint}`);
    });
    log();

    while (true) {
      const raw = (
        await rl.question(`Choose ${dim(`[1-${choices.length}, default ${defaultIndex + 1}]`)} `)
      ).trim();
      if (!raw) return choices[defaultIndex].value;

      const n = Number(raw);
      if (Number.isInteger(n) && n >= 1 && n <= choices.length) return choices[n - 1].value;

      // Also accept the value name itself, e.g. `cursor`.
      const byName = choices.find((c) => c.value === raw.toLowerCase());
      if (byName) return byName.value;

      warn(`Enter a number between 1 and ${choices.length}, or an option name.`);
    }
  });
}
