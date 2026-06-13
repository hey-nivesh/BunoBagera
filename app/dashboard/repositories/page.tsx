"use client";

import { useState, useEffect } from "react";
import { IconBrandGithub, IconSearch, IconFilter, IconStar, IconScan, IconLoader2 } from "@tabler/icons-react";
import { LANGUAGE_COLORS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RepositoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRepos() {
      if (!user?.githubConnected) {
        setLoading(false);
        return;
      }
      
      try {
        const tokenMatch = document.cookie.match(/(^| )auth-token=([^;]+)/);
        const token = tokenMatch ? tokenMatch[2] : null;
        
        if (!token) throw new Error("Not authenticated");

        const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
        const res = await fetch(`${API_URL}/api/github/repos`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch repositories");
        }
        
        const data = await res.json();
        setRepos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRepos();
  }, [user]);

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === "All" || repo.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <IconLoader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  if (!user?.githubConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
        <IconBrandGithub className="w-12 h-12 text-zinc-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Connect GitHub</h2>
        <p className="text-zinc-400 mb-6">You need to connect your GitHub account to view and scan your repositories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header & Filters ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md w-full">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all backdrop-blur-sm"
          />
        </div>
        <div className="relative shrink-0">
          <IconFilter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 z-10 pointer-events-none" />
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            style={{ colorScheme: "dark" }}
            className="appearance-none rounded-xl border border-white/10 bg-zinc-900 pl-10 pr-10 py-2 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-all"
          >
            <option value="All" className="bg-zinc-900 text-white">All Languages</option>
            <option value="TypeScript" className="bg-zinc-900 text-white">TypeScript</option>
            <option value="Python" className="bg-zinc-900 text-white">Python</option>
            <option value="Go" className="bg-zinc-900 text-white">Go</option>
            <option value="Rust" className="bg-zinc-900 text-white">Rust</option>
          </select>
        </div>
      </div>

      {/* ── Repo Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            className="group flex flex-col rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-violet-500/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <IconBrandGithub className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" />
                <h3 className="text-base font-semibold text-white">{repo.name}</h3>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                  repo.private
                    ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                    : "border-green-500/30 bg-green-500/10 text-green-400"
                )}
              >
                {repo.private ? "Private" : "Public"}
              </span>
            </div>

            <div className="mb-6 flex items-center gap-4 text-xs text-zinc-400">
              <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium border", LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.default)}>
                {repo.language}
              </span>
              {repo.stars > 0 && (
                <span className="flex items-center gap-1">
                  <IconStar className="h-3.5 w-3.5 text-yellow-500" />
                  {repo.stars}
                </span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Updated</span>
                <span className="text-xs font-medium text-zinc-300">{new Date(repo.updated_at).toLocaleDateString()}</span>
              </div>
              <Link 
                href={`/dashboard/review/scan?owner=${repo.full_name.split('/')[0]}&repo=${repo.name}`}
                className="flex items-center gap-1.5 rounded-lg bg-violet-600/20 px-3 py-1.5 text-xs font-semibold text-violet-300 transition-colors hover:bg-violet-600/40"
              >
                <IconScan className="h-3.5 w-3.5" />
                Scan Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
