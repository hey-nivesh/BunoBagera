"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCode, IconBrandGithub, IconLoader2 } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 backdrop-blur-sm transition-colors duration-200 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30";

export default function SignupPage() {
  const { signUp, signInWithGithub, setAuthActionLoading } = useAuth();
  const router = useRouter();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setAuthActionLoading("Creating your account...");
    setError("");
    try {
      await signUp(name, email, password);
      router.replace("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setAuthActionLoading(null);
      setLoading(false);
    }
  }

  function handleGithubLogin() {
    setAuthActionLoading("Redirecting to GitHub...");
    try {
      signInWithGithub();
    } catch (err: any) {
      setError("Could not redirect to GitHub. Try again.");
      setAuthActionLoading(null);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md shadow-2xl shadow-black/40">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
          <IconCode className="h-6 w-6 text-white" stroke={2} />
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">
          BuboBagera
        </span>
      </div>

      {/* Heading */}
      <h1 className="mb-1 text-center text-2xl font-bold text-white">
        Create your account
      </h1>
      <p className="mb-8 text-center text-sm text-zinc-500">
        Start reviewing code with AI in seconds
      </p>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="signup-confirm" className="mb-1.5 block text-xs font-medium text-zinc-400">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition-all duration-200 hover:bg-violet-500 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <IconLoader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-zinc-600">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* GitHub */}
      <button
        type="button"
        onClick={handleGithubLogin}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
      >
        <IconBrandGithub className="h-4.5 w-4.5" />
        Continue with GitHub
      </button>

      {/* Footer link */}
      <p className="mt-8 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
