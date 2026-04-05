import type { Account, AccountRole } from "../types";
import { MOCK_ACCOUNTS } from "./data";
import { clone, mockLatency } from "./latency";

export async function listAccounts(): Promise<Account[]> {
  await mockLatency();
  return clone(MOCK_ACCOUNTS);
}

export async function createAccount(input: {
  email: string;
  role: AccountRole;
}): Promise<Account> {
  await mockLatency();
  const account: Account = {
    email: input.email,
    role: input.role,
    created: new Date().toLocaleDateString("en-CA", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    lastLogin: "—",
  };
  MOCK_ACCOUNTS.push(account);
  return clone(account);
}

export async function deleteAccount(email: string): Promise<boolean> {
  await mockLatency();
  const idx = MOCK_ACCOUNTS.findIndex((a) => a.email === email);
  if (idx === -1) return false;
  MOCK_ACCOUNTS.splice(idx, 1);
  return true;
}
