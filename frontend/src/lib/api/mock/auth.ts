import type { AuthSession, Role } from "../types";
import { mockLatency } from "./latency";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Mock credential check. Mirrors the prototype's intent (prototype line 392):
 *   - email containing "admin" → admin role
 *   - any other non-empty email + password → operator
 *   - empty email or password → AuthError
 *
 * The real implementation will replace this with a POST /auth/login call
 * returning the same AuthSession shape.
 */
export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  await mockLatency();
  if (!email.trim() || !password) {
    throw new AuthError("Invalid email or password. Please try again.");
  }
  const role: Role = email.toLowerCase().includes("admin") ? "admin" : "operator";
  return {
    token: `mock-${role}-${Date.now().toString(36)}`,
    role,
    email,
  };
}

export async function register(
  email: string,
  password: string
): Promise<AuthSession> {
  await mockLatency();
  if (!email.trim() || password.length < 8) {
    throw new AuthError("Password must be at least 8 characters.");
  }
  return {
    token: `mock-operator-${Date.now().toString(36)}`,
    role: "operator",
    email,
  };
}

export async function publicSession(): Promise<AuthSession> {
  await mockLatency();
  return { token: "mock-public", role: "public", email: "" };
}
