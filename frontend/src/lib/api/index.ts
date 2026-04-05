/**
 * SCEMAS API barrel.
 *
 * Pages import from `@/lib/api` — never from `mock/` or `real/` directly.
 * This file chooses the implementation based on `NEXT_PUBLIC_API_MODE`:
 *   - `mock` (default) → simulated latency + seeded data from `mock/`
 *   - `real`           → fetch calls against the live backend from `real/`
 *
 * When the real backend is ready, add a matching module under `real/` for
 * each domain and switch the branches below. The function signatures on both
 * sides must stay identical so pages keep working unchanged.
 */

import * as mockAuth from "./mock/auth";
import * as mockZones from "./mock/zones";
import * as mockAlerts from "./mock/alerts";
import * as mockSensors from "./mock/sensors";
import * as mockRankings from "./mock/rankings";
import * as mockAccounts from "./mock/accounts";
import * as mockRules from "./mock/rules";
import * as mockAudit from "./mock/audit";
import * as mockApiDocs from "./mock/apiDocs";

const mode = process.env.NEXT_PUBLIC_API_MODE ?? "mock";
export const API_MODE: "mock" | "real" = mode === "real" ? "real" : "mock";

// When API_MODE === "real", replace the right-hand side of each assignment
// with the corresponding `real/<domain>` module. Kept as mock-only for now
// so the surface is entirely stub-free at runtime.
export const authApi = mockAuth;
export const zonesApi = mockZones;
export const alertsApi = mockAlerts;
export const sensorsApi = mockSensors;
export const rankingsApi = mockRankings;
export const accountsApi = mockAccounts;
export const rulesApi = mockRules;
export const auditApi = mockAudit;
export const apiDocsApi = mockApiDocs;

export { AuthError } from "./mock/auth";
export type { RankingSort } from "./mock/rankings";
export * from "./types";
