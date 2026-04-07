import type { Account, AccountRole } from "../types";
import { request } from "./client";

export async function listAccounts(): Promise<Account[]> {
  return request<Account[]>("/api/v1/accounts");
}

export async function createAccount(input: {
  email: string;
  role: AccountRole;
}): Promise<Account> {
  return request<Account>("/api/v1/accounts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteAccount(email: string): Promise<boolean> {
  await request<void>(`/api/v1/accounts/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
  return true;
}
