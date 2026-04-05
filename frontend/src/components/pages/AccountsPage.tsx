"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Label,
  Select,
} from "@/components/ui";
import {
  accountsApi,
  type Account,
  type AccountRole,
} from "@/lib/api";

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccountRole>("Operator");

  useEffect(() => {
    let cancelled = false;
    void accountsApi.listAccounts().then((data) => {
      if (!cancelled) setAccounts(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setEmail("");
    setPassword("");
    setRole("Operator");
  }

  async function handleCreate() {
    if (!email.trim() || !password.trim()) return;
    setSubmitting(true);
    const created = await accountsApi.createAccount({
      email: email.trim(),
      role,
    });
    setAccounts((prev) => [...prev, created]);
    resetForm();
    setShowCreate(false);
    setSubmitting(false);
  }

  async function handleDelete(targetEmail: string) {
    const ok = await accountsApi.deleteAccount(targetEmail);
    if (ok) setAccounts((prev) => prev.filter((a) => a.email !== targetEmail));
  }

  return (
    <div className="mx-auto max-w-[1200px] px-6">
      <header className="flex items-center justify-between py-8 pb-6">
        <h1 className="text-3xl font-bold tracking-[-0.04em]">Accounts</h1>
        <Button variant="primary" onClick={() => setShowCreate((v) => !v)}>
          <Icon name="plus" size={14} /> Create Account
        </Button>
      </header>

      {showCreate && (
        <Card className="mb-4">
          <h3 className="mb-4 text-base font-semibold tracking-[-0.01em]">
            New Account
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Email</Label>
              <Input
                placeholder="user@scemas.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value as AccountRole)}
              >
                <option value="Operator">Operator</option>
                <option value="Administrator">Administrator</option>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowCreate(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create"}
            </Button>
          </div>
        </Card>
      )}

      <Card className="mb-12">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Email", "Role", "Created", "Last Login", ""].map((h) => (
                <th
                  key={h || "actions"}
                  className="border-b border-border-default px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.05em] text-text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accounts.map((a) => (
              <tr key={a.email}>
                <td className="border-b border-border-default px-4 py-3 text-[13px] font-medium">
                  {a.email}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <Badge
                    variant={a.role === "Administrator" ? "info" : "default"}
                  >
                    {a.role}
                  </Badge>
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs text-text-secondary">
                  {a.created}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-xs text-text-secondary">
                  {a.lastLogin}
                </td>
                <td className="border-b border-border-default px-4 py-3 text-[13px]">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Edit account"
                      className="text-text-muted hover:text-text"
                    >
                      <Icon name="edit" size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete account"
                      onClick={() => handleDelete(a.email)}
                      className="text-text-muted hover:text-error"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
