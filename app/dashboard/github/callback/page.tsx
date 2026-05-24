"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IconLoader2 } from "@tabler/icons-react";

function GithubCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState("Connecting your GitHub account...");
  const [error, setError] = useState<string | null>(null);
  
  // Guard ref to prevent double-execution in dev mode StrictMode
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    
    const code = searchParams.get("code");
    
    if (!code) {
      setError("No authorization code found in URL.");
      return;
    }

    hasRun.current = true;

    const connectGithub = async () => {
      try {
        const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;

        if (!token) {
          throw new Error("You must be logged in to connect GitHub.");
        }

        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

        const res = await fetch(`${API_URL}/api/github/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || data.message || "Failed to connect to GitHub");
        }

        setStatus("Successfully connected! Redirecting...");
        
        await refreshUser();
        
        router.replace("/dashboard");
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      }
    };

    connectGithub();
  }, [searchParams, router, refreshUser]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        {error ? (
          <>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Connection Failed</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <button 
              onClick={() => router.replace("/dashboard")}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Return to Dashboard
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-violet-500/10 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconLoader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Please wait</h2>
            <p className="text-zinc-400">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <IconLoader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    }>
      <GithubCallbackContent />
    </Suspense>
  );
}
