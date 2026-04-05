/**
 * Stub for the real backend client. When `NEXT_PUBLIC_API_MODE=real` is set in
 * `.env.local`, the barrel at `src/lib/api/index.ts` will swap the mock
 * modules out for this one. Leaving this unimplemented for now — every real
 * endpoint should mirror the function signatures exported by the mock modules
 * so pages don't need to change.
 *
 * See SCEMAS-architecture.md "API Endpoints" for the canonical URL map.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as unknown as T;
  }
  return res.json() as Promise<T>;
}
