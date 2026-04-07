/**
 * SCEMAS API barrel.
 *
 * Pages import from `@/lib/api` — never from `mock/` or `real/` directly.
 * This file chooses the implementation based on `NEXT_PUBLIC_API_MODE`:
 *   - `mock` → simulated latency + seeded data from `mock/`
 *   - `real` → fetch calls against the live backend from `real/`
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

import * as realAuth from "./real/auth";
import * as realZones from "./real/zones";
import * as realAlerts from "./real/alerts";
import * as realSensors from "./real/sensors";
import * as realRankings from "./real/rankings";
import * as realAccounts from "./real/accounts";
import * as realRules from "./real/rules";
import * as realAudit from "./real/audit";
import * as realApiDocs from "./real/apiDocs";

const mode = process.env.NEXT_PUBLIC_API_MODE ?? "real";
export const API_MODE: "mock" | "real" = mode === "real" ? "real" : "mock";

export const authApi = API_MODE === "real" ? realAuth : mockAuth;
export const zonesApi = API_MODE === "real" ? realZones : mockZones;
export const alertsApi = API_MODE === "real" ? realAlerts : mockAlerts;
export const sensorsApi = API_MODE === "real" ? realSensors : mockSensors;
export const rankingsApi = API_MODE === "real" ? realRankings : mockRankings;
export const accountsApi = API_MODE === "real" ? realAccounts : mockAccounts;
export const rulesApi = API_MODE === "real" ? realRules : mockRules;
export const auditApi = API_MODE === "real" ? realAudit : mockAudit;
export const apiDocsApi = API_MODE === "real" ? realApiDocs : mockApiDocs;

export { AuthError } from "./real/auth";
export type { RankingSort } from "./real/rankings";
export * from "./types";
