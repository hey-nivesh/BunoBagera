"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { type User } from "@/lib/mock-data";

import { AuthLoader } from "@/components/ui/AuthLoader";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setCookie(name: string, value: string, days = 7) {
  const exp = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${exp};path=/;SameSite=Lax`;
}
function delCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}
function getCookie(name: string) {
  return (
    document.cookie
      .split("; ")
      .find((r) => r.startsWith(`${name}=`))
      ?.split("=")[1] ?? null
  );
}

/** Fetch with a timeout (default 10 s) so auth never hangs indefinitely. */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 10_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Transform Strapi User to Frontend User
function mapStrapiUser(data: any): User {
  return {
    id: String(data.id),
    name: data.username || "User",
    email: data.email || "",
    avatar: "/avatars/default.png",
    githubUsername: data.githubUsername || "",
    githubConnected: !!data.githubConnected,
    plan: data.plan || "free",
    reviewsUsed: data.reviewCount || 0,
    reviewsLimit: data.plan === "pro" ? 999 : data.plan === "enterprise" ? 9999 : 50,
  };
}

// ─── Context types ────────────────────────────────────────────────────────────

type AuthCtx = {
  user: User | null;
  isLoading: boolean;
  authActionLoading: string | null;
  setAuthActionLoading: (msg: string | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  signInWithGithub: () => void;
  handleGithubCallback: (code: string, state: string) => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authActionLoading, setAuthActionLoading] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const token = getCookie("auth-token");
    if (token) {
      try {
        const res = await fetchWithTimeout(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(mapStrapiUser(data));
        } else {
          delCookie("auth-token");
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetchWithTimeout(`${API_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Login failed");

    setCookie("auth-token", data.jwt);
    setUser(mapStrapiUser(data.user));
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetchWithTimeout(`${API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Registration failed");

      setCookie("auth-token", data.jwt);
      setUser(mapStrapiUser(data.user));
    },
    []
  );

  const signOut = useCallback(() => {
    setUser(null);
    delCookie("auth-token");
    window.location.replace("/login");
  }, []);

  /**
   * Redirects the browser to GitHub's OAuth authorization page.
   * A random `state` param is stored in sessionStorage for CSRF protection
   * and verified in handleGithubCallback.
   */
  const signInWithGithub = useCallback(() => {
    const state = crypto.randomUUID();
    sessionStorage.setItem("github_oauth_state", state);

    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${window.location.origin}/dashboard/github/callback`,
      scope: "read:user user:email",
      state,
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  }, []);

  /**
   * Called from /dashboard/github/callback after GitHub redirects back.
   * Verifies CSRF state, sends the code to Strapi, and sets the auth cookie.
   */
  const handleGithubCallback = useCallback(
    async (code: string, state: string) => {
      // CSRF check
      const savedState = sessionStorage.getItem("github_oauth_state");
      sessionStorage.removeItem("github_oauth_state");

      if (!savedState || savedState !== state) {
        throw new Error("Invalid OAuth state. Please try signing in again.");
      }

      const res = await fetchWithTimeout(`${API_URL}/api/auth/github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || data.message || "GitHub authentication failed");

      setCookie("auth-token", data.jwt);
      setUser(mapStrapiUser(data.user));
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authActionLoading,
        setAuthActionLoading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        signInWithGithub,
        handleGithubCallback,
      }}
    >
      {children}
      {authActionLoading && <AuthLoader message={authActionLoading} />}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
