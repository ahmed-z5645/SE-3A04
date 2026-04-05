"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthError, authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button, Card, Icon, Input, Label } from "@/components/ui";

export function CreateAccountPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register(email, password);
      // Register returns a session but we round-trip through signIn so the
      // AuthContext persists the new session identically to the login flow.
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : "Unable to create account. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-[360px]">
        <div className="mb-10 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-xl font-bold tracking-[-0.02em]">
            <Icon name="logo" size={28} />
            SCEMAS
          </div>
        </div>

        <Card className="p-8">
          <h2 className="mb-6 text-xl font-semibold tracking-[-0.02em]">
            Create account
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-center gap-2 rounded-md border border-error-border bg-error-bg px-3.5 py-2.5 text-[13px] text-error"
            >
              <Icon name="alert" size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <Label htmlFor="ca-email">Email</Label>
              <Input
                id="ca-email"
                type="email"
                placeholder="you@scemas.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="ca-password">Password</Label>
              <Input
                id="ca-password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="ca-confirm">Confirm Password</Label>
              <Input
                id="ca-confirm"
                type="password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center py-2.5"
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-center text-[13px] text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
