import type { AuthSession, Role } from "../types";
import { request } from "./client";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  return request<AuthSession>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  email: string,
  password: string
): Promise<AuthSession> {
  return request<AuthSession>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function publicSession(): Promise<AuthSession> {
  return request<AuthSession>("/api/v1/auth/public-session", {
    method: "POST",
  });
}
