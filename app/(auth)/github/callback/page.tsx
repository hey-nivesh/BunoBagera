"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { IconLoader2, IconAlertCircle } from "@tabler/icons-react";

function GithubAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGithubCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Guard ref to prevent double-execution in dev mode StrictMode
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    
    if (!code || !state) {
      setError("Missing authorization code or state in callback URL.");
      return;
    }

    hasRun.current = true;

    const authenticate = async () => {
      try {
        await handleGithubCallback(code, state);
        // Optimistic redirect to dashboard
        router.replace("/dashboard");
      } catch (err: any) {
        setError(err.message || "GitHub authentication failed.");
      }
    };

    authenticate();
  }, [searchParams, router, handleGithubCallback]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-10 backdrop-blur-md shadow-2xl shadow-black/40 text-center max-w-md w-full animate-fade-in">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-lg shadow-red-500/10">
          <IconAlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{error}</p>
        <button 
          onClick={() => router.replace("/login")}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/20 active:scale-[0.98]"
        >
          Return to Log In
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md shadow-2xl shadow-black/40 text-center max-w-md w-full overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute -inset-10 bg-gradient-to-r from-violet-600/10 to-violet-500/10 rounded-full blur-2xl opacity-70 animate-pulse" />
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-violet-600/10 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-violet-500/20 shadow-lg shadow-violet-600/10 animate-bounce-slow">
          <IconLoader2 className="w-8 h-8 animate-spin" stroke={2} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 animate-pulse">Completing GitHub Sign-In</h2>
        <p className="text-zinc-400 text-sm">Please wait while we set up your secure session...</p>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default function GithubAuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md shadow-2xl shadow-black/40 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-violet-600/10 text-violet-500 rounded-full flex items-center justify-center mx-auto mb-5 border border-violet-500/20 shadow-lg shadow-violet-600/10">
          <IconLoader2 className="w-8 h-8 animate-spin" stroke={2} />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Please wait</h2>
        <p className="text-zinc-400 text-sm">Loading callback parameters...</p>
      </div>
    }>
      <GithubAuthCallbackContent />
    </Suspense>
  );
}
