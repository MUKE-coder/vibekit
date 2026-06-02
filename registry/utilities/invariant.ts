/**
 * Dev-time assertion helpers. Use these instead of `if (!x) throw new Error()`
 * boilerplate. In production builds, the messages can be stripped by a minifier
 * keyed off the function name (the messages are descriptive — the throw still
 * happens, just with a shorter payload).
 *
 *   invariant(user, "expected a user");
 *   const user = assert(maybeUser, "user must be loaded by here");
 *
 * After the call, TypeScript narrows the value: `invariant(x)` narrows `x` to
 * be truthy in the rest of the function.
 */

export class InvariantViolation extends Error {
  constructor(message: string) {
    super(`Invariant failed: ${message}`);
    this.name = "InvariantViolation";
  }
}

/** Throws if `condition` is falsy. Narrows `condition` to truthy below the call. */
export function invariant(condition: unknown, message: string): asserts condition {
  if (condition) return;
  throw new InvariantViolation(message);
}

/** Throws if `value` is null or undefined. Returns the narrowed value. */
export function assert<T>(value: T, message: string): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new InvariantViolation(message);
  }
  return value as NonNullable<T>;
}

/** Used to mark unreachable branches in a switch/discriminated-union. */
export function exhaustive(value: never, message = "unexpected variant"): never {
  throw new InvariantViolation(`${message}: ${JSON.stringify(value)}`);
}
