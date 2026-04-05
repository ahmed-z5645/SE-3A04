"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi, type AuthSession, type Role } from "@/lib/api";

const STORAGE_KEY = "scemas.session";

interface AuthContextValue {
  /** Current session, or `null` if not signed in. */
  session: AuthSession | null;
  /** Shorthand — `session?.role ?? null`. */
  role: Role | null;
  /** `true` until the initial localStorage read completes on mount. */
  loading: boolean;
  /** Sign in with credentials. Throws `AuthError` on failure. */
  signIn: (email: string, password: string) => Promise<AuthSession>;
  /** Start a public (read-only) session — no credentials required. */
  continueAsPublic: () => Promise<AuthSession>;
  /** Clear session and wipe localStorage. */
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Always start with `null` on both server and client. The real value is
  // hydrated from localStorage in the effect below — doing it there (not in
  // `useState`'s initializer) keeps SSR output deterministic and avoids a
  // hydration mismatch.
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(readStoredSession());
    setLoading(false);
  }, []);

  const persist = useCallback((next: AuthSession | null) => {
    setSession(next);
    if (typeof window === "undefined") return;
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const next = await authApi.login(email, password);
      persist(next);
      return next;
    },
    [persist]
  );

  const continueAsPublic = useCallback(async () => {
    const next = await authApi.publicSession();
    persist(next);
    return next;
  }, [persist]);

  const signOut = useCallback(() => {
    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      role: session?.role ?? null,
      loading,
      signIn,
      continueAsPublic,
      signOut,
    }),
    [session, loading, signIn, continueAsPublic, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
