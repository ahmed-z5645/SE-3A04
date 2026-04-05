/**
 * Simulated network latency for mock API calls. Keeping it centralized here
 * means we can tune responsiveness globally (e.g. set to 0 for tests, or turn
 * up to stress-test loading states) and every mock behaves identically.
 */

const MIN_MS = 180;
const MAX_MS = 360;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mockLatency(): Promise<void> {
  const ms = MIN_MS + Math.random() * (MAX_MS - MIN_MS);
  return sleep(ms);
}

/** Deep clone the seed so callers can mutate the returned value freely. */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
