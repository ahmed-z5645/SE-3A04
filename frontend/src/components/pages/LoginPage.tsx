"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthError } from "@/lib/api";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button, Card, Icon, Input, Label } from "@/components/ui";

export function LoginPage() {
  const router = useRouter();
  const { signIn, continueAsPublic } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await signIn(email, password);
      router.replace(session.role === "public" ? "/overview" : "/dashboard");
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  async function handlePublic() {
    setError("");
    setLoading(true);
    try {
      await continueAsPublic();
      router.replace("/overview");
    } catch {
      setError("Unable to continue. Please try again.");
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
          <p className="text-sm text-text-secondary">
            Smart City Environmental Monitoring
          </p>
        </div>

        <Card className="p-8">
          <h2 className="mb-6 text-xl font-semibold tracking-[-0.02em]">
            Sign in
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
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@scemas.ca"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full justify-center py-2.5"
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <div className="mt-4 text-center text-[13px] text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/create-account"
              className="text-accent hover:text-accent-hover"
            >
              Create one
            </Link>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handlePublic}
            disabled={loading}
            className="cursor-pointer text-xs text-text-muted hover:text-text-secondary disabled:opacity-60"
          >
            Continue as public user →
          </button>
        </div>
      </div>
    </div>
  );
}
