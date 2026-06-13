"use client";

import { useEffect, useState } from "react";
import { 
  IconBrandGithub, 
  IconLoader2, 
  IconRefresh, 
  IconBrain, 
  IconCircleCheck, 
  IconSparkles, 
  IconAlertCircle 
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

interface Language {
  name: string;
  percentage: number;
  color: string;
}

interface AnalysisData {
  developerPersona: string;
  profileSummary: string;
  strengths: string[];
  topLanguages: Language[];
  recommendations: string[];
}

export default function GithubAnalyzer() {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("Initializing analyzer...");

  const fetchAnalysis = async (force = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
      const token = tokenMatch ? tokenMatch[2] : null;
      if (!token) {
        setError("Not authenticated");
        return;
      }

      setStatusMessage(force ? "Exploring GitHub repositories..." : "Reading profile cache...");
      if (force) {
        setTimeout(() => setStatusMessage("Running profile through AI model..."), 1200);
        setTimeout(() => setStatusMessage("Synthesizing developer persona & top languages..."), 2500);
      }

      const res = await fetch(`${API_URL}/api/github/profile-analysis${force ? "?force=true" : ""}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || data.message || "Failed to analyze profile");
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while analyzing profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.githubConnected) {
      fetchAnalysis();
    }
  }, [user?.githubConnected]);

  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard/github/callback`
      : "http://localhost:3000/dashboard/github/callback";
    const scope = "repo,user";
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`);
  };

  // 1. Not Connected State
  if (user && !user.githubConnected) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-base font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
            <IconBrandGithub className="h-5 w-5 text-violet-500" />
            GitHub Profile AI Insights
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl">
            Connect your GitHub account to analyze your repositories, highlight developer strengths, and discover AI-generated improvements.
          </p>
        </div>
        <Button 
          onClick={handleConnect}
          className="text-xs font-black uppercase tracking-widest text-black bg-violet-500 hover:bg-violet-400 py-5 px-6 shrink-0 transition-all active:scale-95"
          style={{
            clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)"
          }}
        >
          Connect GitHub
        </Button>
      </div>
    );
  }

  // 2. Loading State (Skeleton or Spinner)
  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-6 relative overflow-hidden">
        {/* Subtle glowing animated border */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-violet-500/5 animate-pulse pointer-events-none" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center animate-spin">
              <IconLoader2 className="w-5 h-5 text-violet-500" />
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-white/5 rounded w-32 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-48 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-1/4" />
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-5/6" />
              <div className="h-3 bg-white/5 rounded w-4/5" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-1/3" />
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded w-full" />
              <div className="h-2 bg-white/5 rounded w-11/12" />
              <div className="h-2 bg-white/5 rounded w-3/4" />
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-zinc-500 mt-2 font-mono">
          {statusMessage}
        </div>
      </div>
    );
  }

  // 3. Error State
  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-4">
        <IconAlertCircle className="w-8 h-8 text-red-400" />
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-white">Analysis Failed</h3>
          <p className="text-xs text-zinc-400 max-w-md">{error}</p>
        </div>
        <Button 
          onClick={() => fetchAnalysis(true)} 
          variant="outline" 
          className="text-xs border-white/10 hover:bg-white/5 text-white gap-2"
        >
          <IconRefresh className="w-3.5 h-3.5" />
          Try Again
        </Button>
      </div>
    );
  }

  // 4. Empty / Initial State (if not analyzed yet)
  if (!analysis) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-4 py-8">
        <IconSparkles className="w-8 h-8 text-violet-500 animate-pulse" />
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-white">Analyze GitHub Profile</h2>
          <p className="text-xs text-zinc-400 max-w-sm">
            Discover your developer persona, top languages, strengths, and AI recommended career actions.
          </p>
        </div>
        <Button 
          onClick={() => fetchAnalysis(true)}
          className="text-xs font-black uppercase tracking-widest text-black bg-violet-500 hover:bg-violet-400 py-5 px-6 transition-all active:scale-95"
          style={{
            clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)"
          }}
        >
          Generate Profile Analysis
        </Button>
      </div>
    );
  }

  // 5. Normal Display State
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-6 relative overflow-hidden transition-all duration-300">
      
      {/* ── Header Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <IconBrain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">GitHub AI Analyzer</h2>
              <span className="inline-flex items-center rounded-full bg-violet-500/20 px-2 py-0.5 text-[9px] font-semibold text-violet-300 border border-violet-500/30 uppercase tracking-wider">
                {analysis.developerPersona}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Insights generated dynamically from your GitHub repositories and activity.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => fetchAnalysis(true)}
          disabled={loading}
          variant="outline"
          className="self-start sm:self-center text-[10px] uppercase font-bold tracking-wider border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-colors gap-1.5 h-8 py-0"
        >
          <IconRefresh className="w-3.5 h-3.5" />
          Regenerate
        </Button>
      </div>

      {/* ── Summary ── */}
      <div className="text-sm text-zinc-300 leading-relaxed bg-black/10 border border-white/[0.02] p-4 rounded-lg">
        {analysis.profileSummary}
      </div>

      {/* ── Columns Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Strengths & Recommendations */}
        <div className="space-y-6">
          {/* Strengths */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <IconCircleCheck className="h-4 w-4 text-violet-500" />
              Key Strengths
            </h3>
            <div className="space-y-2">
              {analysis.strengths.map((strength, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-2.5 text-xs text-zinc-300 transition-all hover:translate-x-1 duration-200"
                >
                  <span className="text-violet-500 font-bold mt-0.5">•</span>
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <IconSparkles className="h-4 w-4 text-violet-500" />
              AI Recommendations
            </h3>
            <div className="space-y-2.5">
              {analysis.recommendations.map((recommendation, i) => (
                <div 
                  key={i} 
                  className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-zinc-300 hover:border-violet-500/20 transition-all duration-200"
                >
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Top Languages (Progress Bars) */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <IconBrandGithub className="h-4 w-4 text-violet-500" />
            Top Repository Languages
          </h3>
          
          <div className="space-y-4.5 pt-1">
            {analysis.topLanguages && analysis.topLanguages.length > 0 ? (
              analysis.topLanguages.map((lang, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{lang.name}</span>
                    <span className="text-zinc-400 font-mono">{lang.percentage}%</span>
                  </div>
                  {/* Progress Bar Track */}
                  <div className="h-2 w-full rounded-full bg-zinc-950 overflow-hidden border border-white/5">
                    {/* Progress Fill (using theme violet-500 which renders as neon green) */}
                    <div 
                      className="h-full rounded-full bg-violet-500 transition-all duration-1000 ease-out" 
                      style={{ 
                        width: `${lang.percentage}%`,
                        boxShadow: "0 0 8px rgba(204, 255, 0, 0.3)"
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 py-4 text-center">
                No language data found in your repositories.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
