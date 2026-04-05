/**
 * Domain types for SCEMAS.
 *
 * These are the contract between every page and the API layer. Mock and real
 * implementations must return values matching these shapes. Adding a field
 * here is a breaking change — update both implementations in lockstep.
 */

export type Role = "admin" | "operator" | "public";

export type ZoneStatus = "good" | "moderate" | "warning" | "alert";

export interface Zone {
  id: string;
  name: string;
  aqi: number;
  temp: number;
  humidity: number;
  noise: number;
  status: ZoneStatus;
  /**
   * Zone centroid coordinates used by the map view. These are the aggregated
   * zone center — NOT individual sensor GPS — per architecture §LR-COMP2 and
   * §BE5 (public API returns masked coordinates at the zone level only).
   */
  lat: number;
  lng: number;
}

export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface Alert {
  id: string;
  zone: string;
  type: string;
  severity: AlertSeverity;
  value: string;
  rule: string;
  time: string;
  status: AlertStatus;
}

export type SensorStatus = "online" | "offline";

export interface Sensor {
  id: string;
  zone: string;
  type: string;
  status: SensorStatus;
  lastPing: string;
  battery: string;
}

export type AccountRole = "Administrator" | "Operator";

export interface Account {
  email: string;
  role: AccountRole;
  created: string;
  lastLogin: string;
}

export type RuleStatus = "active" | "paused";

export interface Rule {
  id: string;
  name: string;
  condition: string;
  zone: string;
  status: RuleStatus;
}

export interface City {
  rank: number;
  name: string;
  aqi: number;
  temp: number;
  noise: number;
  humidity: number;
}

export interface AuditLogEntry {
  time: string;
  user: string;
  action: string;
  detail: string;
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  desc: string;
  example: string;
  response: string;
}

export interface TrendSeries {
  aqi: number[];
  temp: number[];
  humidity: number[];
  noise: number[];
}

export interface AuthSession {
  token: string;
  role: Role;
  email: string;
}
