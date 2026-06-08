"use client";

import React from "react";
import { IconLoader2, IconCode } from "@tabler/icons-react";

interface AuthLoaderProps {
  message?: string;
}

export function AuthLoader({ message = "Please wait..." }: AuthLoaderProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090b]/80 backdrop-blur-md transition-all duration-300 animate-fade-in">
      <div className="relative flex flex-col items-center p-8 rounded-2xl border border-white/10 bg-black/40 shadow-2xl max-w-xs w-full text-center overflow-hidden">
        {/* Glow effect in background */}
        <div className="absolute -inset-10 bg-gradient-to-r from-violet-600/20 to-violet-500/20 rounded-full blur-2xl opacity-75 animate-pulse" />
        
        {/* Spinner container */}
        <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600/10 border border-violet-500/30 shadow-lg shadow-violet-600/20 mb-5 animate-bounce-slow">
          <IconLoader2 className="h-8 w-8 text-violet-500 animate-spin" stroke={2} />
          {/* Subtle branding icon in center of spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <IconCode className="h-3 w-3 text-violet-400 opacity-60" />
          </div>
        </div>

        {/* Message */}
        <h3 className="relative z-10 text-base font-semibold text-white tracking-wide animate-pulse">
          {message}
        </h3>
        <p className="relative z-10 mt-1.5 text-xs text-zinc-500">
          This won&apos;t take long
        </p>

        {/* Dynamic scanning line element for high-tech premium feel */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60 animate-shimmer" />
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
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
